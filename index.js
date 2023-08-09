const Crawler = require('crawler');
const range = require('lodash/range')
const validUrl = require('valid-url');
const saveToExcel = require('./saveToExcel')
const each = require('async-each-series');
const path1 = "/Users/sachin.a.vashist/Desktop/crawler/output1.xlsx";
const path2 = "/Users/sachin.a.vashist/Desktop/crawler/output2.xlsx";

const siteDespCrawler = new Crawler({
    maxConnections: 10,
});
const siteCrawler = new Crawler({
    maxConnections: 10
});

const saveCompanyDetails = async (uri, next) => {
    if (!validUrl.isUri(uri)) return next()
    siteDespCrawler.queue([{
        uri,
        callback: async (error, res, done) => {
            if (error) return error
            done()
            const $ = res.$,
                name = $('.search-page-heading-red').text(),
                details = $('.detail-line'),
                website = details.find('.pglink').attr('href'),
                phone = details.clone().children().remove().end().text()
            await saveToExcel(path2, [name, website, phone], 'website')
            next()
        }
    }])
}

const saveCompany = (res, cb) => {
    const $ = res.$,
        out = $('.search-result-left'),
        outArray = []
    // traversing all results on page
    out.each(function (i, el) {
        let nameTag = $(el).find('a'),
            data = [nameTag.text(), nameTag.attr('href')],
            otherDetails = $(el).find('tr')

        otherDetails.each(function (i, el) {
            data.push($(el).find('td:last-child').text())
        });
        outArray.push(data)
    });

    // traversing data on each result
    each(outArray, async (item, next) => {
        console.log(" ");
        console.log("Getting: ", item[0])
        await saveToExcel(path1, item, 'details')
        // getting phone number for the desp page
        saveCompanyDetails(item[1], next)
    }, function (error) {
        if (error) return error
        cb()
    })

}

each(range(101, 201), (item, next) => {
    console.log("Reading page >>>> ", item)
    siteCrawler.queue([{
        uri: `https://www.fundoodata.com/companies-in/delhi-ncr-l0?&pageno=${item}`,
        callback: async (error, res, done) => {
            if (error) return error
            done()
            saveCompany(res, () => {
                setTimeout(next, 5000)
            })
        }
    }]);
}, function (err) {
    if (err) return err
})

