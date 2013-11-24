# Active Row

Active Row is Active Record library for Google Spreadsheet.

It sees Google Spreadsheet items as database models like this.

* Sheet : Table
* 1st row : Schema(Columns)
* other rows : Datas

The library provides `where`, `count`, `find` and `findByXXX` methods like Active Record in Ruby on Rails.


## Install

* open script editor by clicking "Tool > Script Editor..." at toolbar in Google Spreadsheet.
* create new file "File > New > Script File", and name it  "AR"(anything ok).
* copied ar.gs file content to script editor.

After this, the script added a base object "AR" at google apps script environment.


## How to use

If you have spreadsheet "sheet 1" like this,

id | name | email | is_activate 
-- | ---- | ----- | -----------    
1 | ryan  | ryan@example.com | true
2 | nick  | nick@example.com | false
3 | tom   | tom@example.com  | true

this sample code works like this.

    AR.t('sheet 1').where({is_activate: 'true'}) 
    // return [{id: 1, name: 'ryan', email: 'ryan@example.com'}, {id: 3, name: 'tom', email: 'tom@example.com'}]
    
    AR.t('sheet 1').find(2)
    // return [{id: 2, name: 'nick', email: 'nick@example.com'}]
    
    AR.t('sheet 1').findByName('tom')
    // return [{id: 3, name: 'tom', email: 'tom@example.com'}]


## Copyright

MIT License.
