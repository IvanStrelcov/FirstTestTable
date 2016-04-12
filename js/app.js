'use strict';
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
    var td = document.createElement('td');
    td.innerHTML = this.value;
    return td;
}
function Btn (value) {
    this.value = value;
}
Btn.prototype.render = function() {
    var button = document.createElement('button');
    button.innerHTML = this.value;
    return button;
}
function Row (data) {
    this.data = data;
}
Row.prototype._toArray = function() {
    return [this.data.id, this.data.firstName, this.data.lastName, this.data.email];
}
Row.prototype._createRow = function() {
    var row = document.createElement('tr');
    var dataArray = this._toArray();
    for (var i = 0; i < dataArray.length; i++) {
      var column = new Column(dataArray[i]);
      row.appendChild(column.render());
    }
    return row;
}
Row.prototype._createButton = function() {
    var td = new Column('');
    var button = new Btn('DELETE ROW');
    var resultTd = td.render();
    resultTd.appendChild(button.render());
    return resultTd;
}
Row.prototype.render = function() {
    var finishRow = this._createRow();
    var button = this._createButton();
    finishRow.appendChild(button);
    return finishRow;
}
function TableHead (array) {
    this.array = array;
}
TableHead.prototype.render = function () {
    var resultHead = document.createElement('thead');
    var tableHeadRow = document.createElement('tr');
    for (var i = 0; i < this.array.length; i++) {
      var th = document.createElement('th');
      var button = new Btn(this.array[i]);
      th.appendChild(button.render());
      tableHeadRow.appendChild(th);
    }
    resultHead.appendChild(tableHeadRow);
    return resultHead;
}
function Table (allData) {
    this.allData = allData;
}
Table.prototype._makeTableBody = function () {
    var tBody = document.createElement('tbody');
    for (var i = 0; i < this.allData.data.length; i++) {
      var row = new Row(this.allData.data[i]);
      tBody.appendChild(row.render());
    }
    return tBody;
}
Table.prototype.render = function () {
    var finalTable = document.createElement('table');
    var tHead = new TableHead(this.allData.columns);
    finalTable.appendChild(tHead.render());
    finalTable.appendChild(this._makeTableBody());
    return finalTable;
}
var myTable = new Table(table);
document.body.appendChild(myTable.render());

var tableTarget = document.getElementsByTagName('table')[0];
var tableHead = tableTarget.getElementsByTagName('thead')[0];
    tableHead.addEventListener('click', sortTable);
var tbodyTarget = tableTarget.getElementsByTagName('tbody')[0];
    tbodyTarget.addEventListener('click', deleteRow);
    tbodyTarget.addEventListener('click', addInput);
    tbodyTarget.addEventListener('input', saveValue, true);
    tbodyTarget.addEventListener('blur', changeValue, true);

function deleteRow (event) {
  event.preventDefault();
  var self = event.target;
  if (self.innerHTML == 'DELETE ROW') {
    tbodyTarget.deleteRow(self.parentNode.parentNode.parentNode.rowIndex);
  } else {
    return false;
  }
}

function sortTable (event) {
  event.preventDefault;
  var self = event.target;
  if (self.type = 'submit' && self.innerHTML != 'DELETE ROW') {
    var colNum = self.parentNode.cellIndex;
    var rowsArray = [].slice.call(tbodyTarget.rows);
    var type = self.innerHTML;
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
    tableTarget.removeChild(tbodyTarget);
    for (var i = 0; i < rowsArray.length; i++) {
      tbodyTarget.appendChild(rowsArray[i]);
    }
    tableTarget.appendChild(tbodyTarget);
  } else {
    return false;
  }
}

function addInput (event) {
    event.preventDefault();
    var self = event.target;
    var buttons = tbodyTarget.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
      if (self.contains(buttons[i])){
        return false;
      }
    }
    inputValue = self.innerHTML;
    var input = document.createElement('input');
    input.setAttribute('value', inputValue);
    self.innerHTML = '';
    self.appendChild(input);
    input.focus();
}

var inputValue;

function saveValue (event) {
    self = event.target;
    inputValue = self.value;
}

function changeValue (event) {
    var self = event.target;
    var th = self.parentNode;
    th.removeChild;
    th.innerHTML = inputValue;
}
