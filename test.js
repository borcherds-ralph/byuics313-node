"use strict";
module.exports = function() {
    var reportRequests = [],
        currentIndex = null;
    return {
        report: function() {
            return reportRequests.push({}),
                currentIndex = reportRequests.length - 1,
                this
        },
        viewId: function(id) {
            return reportRequests[currentIndex].viewId = id + "",
                this
        },
        dimension: function(_dimension) {
            var type = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "name",
                obj = {};
            return obj[type] = _dimension, reportRequests[currentIndex].dimensions || (reportRequests[currentIndex].dimensions = []),
                reportRequests[currentIndex].dimensions.push(obj),
                this
        },
        metric: function(_metric) {
            var type = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "expression",
                obj = {};
            return obj[type] = _metric,
                reportRequests[currentIndex].metrics || (reportRequests[currentIndex].metrics = []),
                reportRequests[currentIndex].metrics.push(obj),
                this
        },
        filtersExpression: function(expression) {
            return reportRequests[currentIndex].filtersExpression = expression,
                this
        },
        dateRanges: function(startDate, endDate) {
            reportRequests[currentIndex].dateRanges || (reportRequests[currentIndex].dateRanges = []);
            var dateObj = {
                startDate: startDate,
                endDate: endDate
            };
            return reportRequests[currentIndex].dateRanges.push(dateObj),
                this
        },
        orderBys: function(fieldName, sortOrder) {
            reportRequests[currentIndex].orderBys || (reportRequests[currentIndex].orderBys = []);
            var orderObject = {
                fieldName: fieldName,
                sortOrder: sortOrder
            };
            return reportRequests[currentIndex].orderBys.push(orderObject),
                this
        },
        get: function() {
            var result = {
                reportRequests: reportRequests
            };
            return result
        },
        getJson: function() {
            return JSON.stringify(this.get())
        }
    }
};