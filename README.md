# Active Row

Active Row is Active Record library for Google Spreadsheet.

It sees Google Spreadsheet items as database models like this.

* Sheet : Table
* 1st row : Schema(Columns)
* other rows : Datas

The library provides `where`, `count`, `find` and `findByXXX` methods like Active Record in Ruby on Rails.

**caution** : 

* The library can't handle multiple where keys like `{name: 'test', email: 'test at example.com }` at present.


## Install

* open script editor by clicking "Tool > Script Editor..." at toolbar in Google Spreadsheet.
* create new file "File > New > Script File", and name it  "AR"(anything ok).
* copied ar.gs file content to script editor.

After this, the script added a base object "AR" at google apps script environment.


## How to use

If you have spreadsheet "sheet 1" like this,

id | name | email | is_activate
--- | --- | --- | ---
1 | ryan  | ryan at example.com | true
2 | nick  | nick at example.com | false
3 | tom   | tom at example.com  | true

this sample code works like this.

    AR.t('sheet 1').where({is_activate: 'true'}) 
    // return [{id: 1, name: 'ryan', email: 'ryan at example.com'}, {id: 3, name: 'tom', email: 'tom at example.com'}]
    
    AR.t('sheet 1').find(2)
    // return [{id: 2, name: 'nick', email: 'nick at example.com'}]
    
    AR.t('sheet 1').findByName('tom')
    // return [{id: 3, name: 'tom', email: 'tom at example.com'}]


## Customize

You can change header row index and header column start index.

if you have spreadsheet like this,

<table>
  <thead>
    <tr>
      <th></th>
      <th colspan="3">attributes</th>
    </tr>
    <tr>
      <th>id</th>
      <th>name</th>
      <th>email</th>
      <th>is_activate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>ryan</td>
      <td>ryan at example.com</td>
      <td>true</td>
    </tr>
    <tr>
      <td>2</td>
      <td>tom</td>
      <td>tom at example.com</td>
      <td>false</td>
    </tr>
    <tr>
      <td>3</td>
      <td>nick</td>
      <td>nick at example.com</td>
      <td>true</td>
    </tr>
  </tbody>
</table>
 

    // you can set header column setting at table initialization
    AR.t('sheet 1', {headerColumnStartIndex:1, headerRowIndex: 2}).where(name: 'tom');

    // you can set 


## Contribution

Patch welcome! If you have question, please ask me at github issues.


## Copyright

MIT License.
