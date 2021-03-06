(function(global) {

/**
 * ActiveRowを使うベースとなるオブジェクト
 *
 * 使用例:
 *   AR.t('シート1').where({name: 'nick'}); // => returns [{id: 1, name: nick, email: 'nick@example.com'}]
 *
 */
var AR = {
  /**
   * シート名で指定されたシートを、テーブルとして返す
   * @param {String} name   シート名
   * @param {Object] option テーブルの初期化オプション
   */
  t: function(name, option) {
    if (typeof AR.memoTables === "undefined") { AR.memoTables = {}; }

    if (!AR.memoTables[name]) {
      AR.memoTables[name] = new ARTable(name, option);
    } else {
      if (typeof option !== "undefined" &&
          !Util.isEqual(AR.memoTables[name].getOption(), option)) {
        AR.memoTables[name].setOption(option);
      }
    }

    return AR.memoTables[name];
  },
};

/**
 * 各シートをテーブルと見なすクラス
 * @constructor
 */
var ARTable = function(name, option) {
  this.name = name;
  this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (this.sheet === null) {
    throw new SheetNotFoundException("Sheet: " + name + "was not found.");
  }

  var defaultOption = {
                        headerRowIndex:         1,
                        headerColumnStartIndex: 1,
                      };
  if (typeof option === "undefined" || Object.keys(option).length === 0) {
    this.option = defaultOption;
  } else {
    this.option = Util.extend(defaultOption, option);
  }


  // columnを設定する
  this.column = {};
  this.inverseColumn = {};
  var headerRow = this.sheet.getRange(this.option.headerRowIndex,
                                      this.option.headerColumnStartIndex,
                                      1,
                                      this.sheet.getLastColumn()).getValues();
  for (var i = 0; i < headerRow[0].length; i++) {
    var that                  = this,
        columnName            = headerRow[0][i],
        capitalizedColumnName = columnName.charAt(0).toUpperCase() + columnName.slice(1);

    this.column[columnName] = i + 1;
    this.inverseColumn[i] = columnName;

    //findByXXXメソッドを定義する
    ARTable.prototype['findBy' + capitalizedColumnName] = function() {
      var newColumnName = columnName.slice(0);

      return function(data) {
        var whereParams = {};
        whereParams[newColumnName] = data;

        return that.where(whereParams);
      };
    }();
  }
};

ARTable.prototype = {
  /**
   * IDベースでレコードを検索する
   * @param {Integer} id 検索したい行の、IDコラムの値
   */
  find: function(id) {
    return this.where({id: id});
  },

  /**
   * optionで指定した行の数を数える
   * @param {Object} option
   */
  count: function(option) {
    var keys          = Object.keys(option),
        hitRowIndexes = this._seekRows(keys[0], option[keys[0]]);

    return hitRowIndexes.length;
  },

  /**
   * optionで指定した行をオブジェクト配列で返す
   * @param {Object} option
   */
  where: function(option) {
    var keys          = Object.keys(option),
        hitRowIndexes = this._seekRows(keys[0], option[keys[0]]);
    if (hitRowIndexes.length === 0) {
      return [];
    }

    return this._createTableObjects(hitRowIndexes);
  },

  getOption: function() {
    return this.option;
  },

  setOption: function(option) {
    this.option = option;
  },

  /**
   * 指定されたコラムに該当するデータのある行を探す
   * @param {String} column コラムの文字列
   * @param {String} data   データ
   */
  _seekRows: function(column, data) {
    var hitRowIndexes     = [],
        columnIndex       = this.column[column],
        dataRowStartIndex = this.option.headerRowIndex + 1,
        columnValues      = this.sheet.getRange(dataRowStartIndex,
                                                columnIndex,
                                                this.sheet.getLastRow()).getValues();

    for (var i = 0; i < columnValues.length; i++) {
      if (columnValues[i][0] === data) {
        hitRowIndexes.push(dataRowStartIndex + i);
      }
    }

    return hitRowIndexes;
  },

  /**
   * ヒットした行のデータにkeyを足してオブジェクト配列として返す
   * @param {Array} hitRowIndexes ヒットした行のID群
   */
  _createTableObjects: function(hitRowIndexes) {
    var result = [];

    for (var i = 0; i < hitRowIndexes.length; i++) {
      var tmpResult = {},
          rowValues = this.sheet.getRange(hitRowIndexes[i],
                                          this.option.headerColumnStartIndex,
                                          1,
                                          this.sheet.getLastColumn()).getValues();
      for (var j = 0; j < rowValues[0].length; j++) {
        tmpResult[this.inverseColumn[j]] = rowValues[0][j];
      }

      if (Object.keys(tmpResult).length !== 0) {
        result.push(tmpResult);
      }
    }

    return result;
  },
};


var Util = {
  extend: function(dest, source){
    for (var property in source) {
      dest[property] = source[property];
    }

    return dest;
  },

  isEqual: function(objA, objB) {
    var objAKeys = Object.keys(objA);
    var objBKeys = Object.keys(objB);

    if (objAKeys.length !== objBKeys.length) { return false; }

    for (var i = 0; i < objAKeys.length; i++) {
      if (objA[objAKeys[i]] !== objB[objAKeys[i]]) {
        return false;
      }
    }

    return true;
  },
};


/**
 * AR.tメソッドで指定されたシートが存在しない場合に出す例外クラス
 * @constructor
 */
var SheetNotFoundException = function(message) {
  this.message = message;
  this.name = "SheetNotFoundException";
};

global.AR = AR;

})(this);
