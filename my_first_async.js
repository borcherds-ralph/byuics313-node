const fs = require('fs')

var filePath = process.argv[2]

fs.readFile(filePath, function(err, contents) {
    if (err) {
        return console.error('There was an error: ' + err)

    }
    const lines = contents.toString().split('\n').length - 1
    console.log(lines)
})