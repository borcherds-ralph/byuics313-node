const fs = require('fs')

var parseData = require('./filteredLS_module')
var workPath = process.argv[2]
var filteredStr = process.argv[3]

parseData(workPath, filteredStr, function(err, list) {
    if (err) {
        return console.error('There was an error: ' + err)
    }

    list.forEach(function(file) {
        console.log(file)
    })
})