const Crawler = require('crawler');
const range = require('lodash/range')
const saveToExcel = require('./saveToExcel')
const each = require('async-each-series');
const path1 = "/Users/sachin.a.vashist/Desktop/crawler/output1.xlsx";
const path2 = "/Users/sachin.a.vashist/Desktop/crawler/output2.xlsx";


const siteDespCrawler = new Crawler({
    maxConnections: 10,
    callback: (error, res, done) => {
        if (error) return error
        const $ = res.$;
        let name = $('.search-page-heading-red').text(),
            details = $('.detail-line'),
            website = details.find('.pglink').attr('href'),
            phone = details.clone().children().remove().end().text()
        saveToExcel(path2, [[name, website, phone]], 'website')

        done();
    }
});


const siteCrawler = new Crawler({
    maxConnections: 10,
    callback: (error, res, done) => {
        if (error) return error
        const $ = res.$;
        let out = $('.search-result-left')
        let outArray = []
        out.each(function (i, el) {
            let nameTag = $(el).find('a'),
                data = [nameTag.text()],
                despLink = nameTag.attr('href'),
                otherDetails = $(el).find('tr')

            otherDetails.each(function (i, el) {
                let dataValue = $(el).find('td:last-child').text()
                data.push(dataValue)
            });
            outArray.push(data)
            siteDespCrawler.queue(despLink);
        });
        saveToExcel(path1, outArray, 'details')
        done();
    }
});

siteCrawler.queueSize = 1
siteDespCrawler.queueSize = 1


each(range(1, 10), (item, next) => {
    let url = `https://www.fundoodata.com/companies-in/delhi-ncr-l0?&pageno=${item}`
    console.log(url)
    siteCrawler.queue(url);
    next()
}, function (err) {
    if (err) return err
})