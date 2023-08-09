const ExcelJS = require('exceljs');
const Crawler = require('crawler');
const path2 = "/Users/sachin.a.vashist/Desktop/crawler/output2.xlsx";
const path3 = "/Users/sachin.a.vashist/Desktop/crawler/output3.xlsx";
const each = require('async-each-series');
const validUrl = require('valid-url');
const saveToExcel = require('./saveToExcel')
const workbook = new ExcelJS.Workbook();
const validateIt = require('./helper/validateIt')
const siteCrawler = new Crawler({
    maxConnections: 10
});

const saveCompanyContacts = async (uri, next) => {
    if (typeof uri !== 'string' || !validUrl.isUri(uri)) return next()
    siteCrawler.queue([{
        uri: 'http://serverguy.com',
        callback: async (error, res, done) => {
            if (error) return next()
            done()
            const $ = res.$,
                output = $('body').text()
            console.log(output)
            //     details = $('.detail-line'),
            //     website = details.find('.pglink').attr('href'),
            //     phone = details.clone().children().remove().end().text()
            // await saveToExcel(path2, [name, website, phone], 'website')
            // next()
        }
    }])
}

workbook.xlsx.readFile(path2)
    .then(function () {
        let worksheet = workbook.getWorksheet(1)
        let sitesArray = worksheet.getColumn(2).values
        each(sitesArray, (uri, next) => {
            console.log("Reading site >>>> ", uri)
            saveCompanyContacts(uri, next)
        }, function (err) {
            if (err) return err
        })
    })

