"use strict";
exports.__esModule = true;
var data_1 = require("./data");
console.clear();
console.log("-------------------------------------------------------------------------------------------------------------------------------------------");
var GanttDiagram = /** @class */ (function () {
    function GanttDiagram(rawInput) {
        this.peerData = [];
        this.names = [];
        this.rawData = rawInput;
    }
    GanttDiagram.prototype.transformData = function () {
        var _this = this;
        this.rawData.forEach(function (item) {
            if (item.date != null) {
                _this.peerData.push({
                    from: item.from,
                    date: new Date(item.date),
                    to: item.to
                });
            }
        });
    };
    GanttDiagram.prototype.sortDataByDate = function () {
        this.peerData = this.peerData.sort(function (b, a) { return b.date.getTime() - a.date.getTime(); });
    };
    GanttDiagram.prototype.sortDataByName = function () {
        this.peerData = this.peerData.sort(function (a, b) { return (a > b ? -1 : 1); });
    };
    GanttDiagram.prototype.getNumberOfDays = function () {
        this.sortDataByDate();
        var firstDate = this.peerData[0].date;
        var lastDate = this.peerData[this.peerData.length - 1].date;
        var numOfDays = this.getDifferenceInDays(firstDate, lastDate);
        console.log("Number of days: " + numOfDays);
        return numOfDays;
    };
    GanttDiagram.prototype.getDifferenceInDays = function (date1, date2) {
        var diffInMs = date2.getTime() - date1.getTime();
        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    };
    GanttDiagram.prototype.prettyPrint = function (matrix) {
        for (var i = 0; i < matrix.length; i++) {
            var line = "";
            for (var j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j] == undefined) {
                    matrix[i][j] = "-";
                }
                line += matrix[i][j];
            }
            console.log(this.names[i].name.padEnd(20) + ' ' + line);
            line = "";
        }
    };
    GanttDiagram.prototype.findAllNames = function () {
        var _this = this;
        this.peerData.forEach(function (element) {
            var index = _this.findLast(element.from);
            if (index != -1) {
                _this.names[index].dates.push(element.date);
            }
            else {
                _this.names.push({ name: element.from, dates: [element.date] });
            }
            if (element.to.length) {
                element.to.forEach(function (anotherOne) {
                    if (anotherOne != null) {
                        var index = _this.findLast(anotherOne);
                        if (index != -1) {
                            _this.names[index].dates.push(element.date);
                        }
                        else {
                            _this.names.push({ name: anotherOne, dates: [element.date] });
                        }
                    }
                });
            }
        });
    };
    GanttDiagram.prototype.findLast = function (name) {
        for (var i = 0; i < this.names.length; i++) {
            if (this.names[i].name == name)
                return i;
        }
        return -1;
    };
    GanttDiagram.prototype.prettyMatrix = function () {
        this.transformData();
        this.findAllNames();
        console.log(this.names);
        var numOfDays = this.getNumberOfDays();
        var numOfNames = this.names.length;
        var firstDate = this.peerData[0].date;
        var matrix = [];
        for (var i = 0; i < numOfNames; i++) {
            matrix[i] = [];
            for (var j = 0; j < numOfDays; j++) {
                matrix[i][j] = '-';
            }
        }
        for (var i = 0; i < numOfNames; i++) {
            var dates = this.names[i].dates;
            for (var j_1 = 0; j_1 < dates.length - 1; j_1++) {
                if (this.getDifferenceInDays(dates[j_1], dates[j_1 + 1]) <= 1) {
                    var column = this.getDifferenceInDays(firstDate, dates[j_1]);
                    matrix[i][column] = "=";
                    matrix[i][column + 1] = "=";
                }
            }
        }
        this.prettyPrint(matrix);
    };
    return GanttDiagram;
}());
var obj = new GanttDiagram(data_1.rawInputData);
obj.prettyMatrix();
