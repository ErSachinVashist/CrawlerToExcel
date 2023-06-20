const ExcelJS = require('exceljs');
const each = require('async-each-series');

const addRowToNewExcel = (excelFilePath, data, type) => {
    var workbook = new ExcelJS.Workbook();
    workbook.xlsx.readFile(excelFilePath)
        .then(async function () {
            each(data, (row, next1) => {
                let worksheet = workbook.getWorksheet(1);
                let lastRow = worksheet.lastRow;
                let getRowInsert = worksheet.getRow(++(lastRow.number));
                let index = 0
                each(['A', 'B', 'C', 'D', 'E', 'F'], (item, next2) => {
                    if (row[index]) {
                        row[index] = row[index]?.replace(/Click here/g, '')
                            .replace(/\t/g, '')
                            .replace(/\n/g, '')
                            .replace(": ", '')
                            .trim()
                        getRowInsert.getCell(item).value = row[index];
                    }
                    index++;
                    next2()
                }
                    , function (err) {
                        console.log(`Added: ${row[0]} ${type}`);
                        getRowInsert.commit();
                        workbook.xlsx.writeFile(excelFilePath);
                        next1()
                    });
            }, function (err) {
                // console.log('finished');
            });
        });

}

module.exports = addRowToNewExcel
