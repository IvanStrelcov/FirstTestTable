'use strict';
$(document).ready( function () {
    var table = {
      columns: ['id', 'First Name', 'Last Name', 'email'],
      data: [
        {
          id: 1,
          firstName: 'Nikolay',
          lastName: 'Galkin',
          email: 'galkin@nixsolutions.com'
        },
        {
          id: 2,
          firstName: 'Ivan',
          lastName: 'Ivanov',
          email: 'ivanov@nixsolutions.com'
        }
      ]
    }
    function Column (value) {
        this.value = value;
    }
    Column.prototype.render = function() {
        var td = $('<td></td>');
        $(td).html(this.value);
        return td;
    }

    function Btn (value) {
        this.value = value;
    }
    Btn.prototype.render = function() {
        var button = $('<button></button>');
        $(button).html(this.value);
        return button;
    }
    function Row (data) {
        this.data = data;
    }
    Row.prototype._toArray = function() {
        return [this.data.id, this.data.firstName, this.data.lastName, this.data.email];
    }
    Row.prototype._createRow = function() {
        var row = $('<tr></tr>');
        var dataArray = this._toArray();
        for (var i = 0; i < dataArray.length; i++) {
          var column = new Column(dataArray[i]);
          $(row).append(column.render());
        }
        return row;
    }
    Row.prototype._createButton = function() {
        var td = new Column('');
        var button = new Btn('DELETE ROW');
        var resultTd = td.render();
        $(resultTd).append(button.render());
        return resultTd;
    }
    Row.prototype.render = function() {
        var finishRow = this._createRow();
        var button = this._createButton();
        $(finishRow).append(button);
        return finishRow;
    }
    function TableHead (array) {
        this.array = array;
    }
    TableHead.prototype.render = function () {
        var resultHead = $('<thead></thead>');
        var tableHeadRow = $('<tr></tr>');
        for (var i = 0; i < this.array.length; i++) {
          var th = $('<th></th>');
          var button = new Btn(this.array[i]);
          $(th).append(button.render());
          $(tableHeadRow).append(th);
        }
        $(resultHead).append(tableHeadRow);
        return resultHead;
    }
    function Table (allData) {
        this.allData = allData;
    }
    Table.prototype._makeTableBody = function () {
        var tBody = $('<tbody></tbody>');
        for (var i = 0; i < this.allData.data.length; i++) {
          var row = new Row(this.allData.data[i]);
          $(tBody).append(row.render());
        }
        return tBody;
    }
    Table.prototype.render = function () {
        var finalTable = $('<table></table>');
        var tHead = new TableHead(this.allData.columns);
        $(finalTable).append(tHead.render());
        $(finalTable).append(this._makeTableBody());
        return finalTable;
    }
    var myTable = new Table(table);
    $('body').append(myTable.render());

    $('table thead').delegate('button', 'click', sortTable);
    $('table tbody').delegate('button', 'click', deleteRow);
    $('table tbody').delegate('td', 'click', addInput);
    $('table tbody').delegate('input', 'input', saveValue);
    $('table tbody').delegate('input', 'blur', changeValue);

    function deleteRow (event) {
      event.preventDefault();
      var self = event.target;
      if ($(self).html() == 'DELETE ROW') {
        $(self).parent().parent().remove();
      } else {
        return false;
      }
    }

    function sortTable (event) {
      event.preventDefault();
      var self = event.target;
      var colNum = $(self).parent().index();
      var rowsArray = $('tbody tr').get();
      var type = $(self).html();
      var compare;
          switch (type) {
            case 'id':
              compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
              };
              break;
            case 'First Name':
            case 'Last Name':
            case 'email':
              compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML.toLowerCase() > rowB.cells[colNum].innerHTML.toLowerCase() ? 1 : -1;
              };
              break;
          }
      rowsArray.sort(compare);
      var tbody = $('<tbody></tbody>');
      $('tbody').remove();
      for (var i = 0; i < rowsArray.length; i++) {
        $(tbody).append(rowsArray[i]);
      }
      $('table').append(tbody);
    }

    var inputValue;

    function addInput (event) {
        event.preventDefault();
        var self = event.target;
        var buttons = $('button');
        for (var i = 0; i < buttons.length; i++) {
          if (self.contains(buttons[i])){
            return false;
          }
        }
        inputValue = $(self).html();
        var input = $('<input/>');
        $(input).val(inputValue);
        $(self).html('');
        $(self).append(input);
        $(input).focus();
    }

    function saveValue (event) {
        var self = event.target;
        inputValue = $(self).val();
    }

    function changeValue (event) {
        var self = event.target;
        $(self).parent().remove('input').html(inputValue);
    }
});
