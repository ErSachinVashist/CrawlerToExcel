const ExcelJS = require('exceljs');
const each = require('async-each-series');
const validateIt = (val) => {
    const isValid = val !== null && val !== undefined && typeof val === 'string'
    if (!isValid) return ""
    return val.replace(/Click here/g, '')
        .replace(/\t/g, '')
        .replace(/\n/g, '')
        .replace(": ", '')
        .trim()
}

const addRowToNewExcel = (excelFilePath, row, type) => {
    return new Promise((resolve, reject) => {
        let workbook = new ExcelJS.Workbook();
        workbook.xlsx.readFile(excelFilePath)
            .then(async function () {
                let worksheet = workbook.getWorksheet(1),
                    lastRow = worksheet.lastRow,
                    getRowInsert = worksheet.getRow(++(lastRow.number))

                const validatedRow = row.map(validateIt)
                getRowInsert.values = validatedRow
                getRowInsert.commit();
                return workbook.xlsx.writeFile(excelFilePath);
            })
            .then(() => {
                console.log(`ADDED! ${type}`);
                resolve()
            })
    })
}

module.exports = addRowToNewExcel
