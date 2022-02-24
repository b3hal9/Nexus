var fs = require('fs')
var { parse } = require('csv-parse')
var parser = parse(
  { columns: true, encoding: 'utf8' },
  function (err, records) {
    console.log(records)
  }
)

fs.createReadStream('./crime.csv').pipe(parser)

// const csvtojson = require('csvtojson')

// const filepath = './crime.csv'
// csvtojson()
//   .fromFile(filepath)
//   .then((json) => console.log(json))
