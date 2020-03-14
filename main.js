const axios = require("axios");
const cheerio = require("cheerio");
const siteUrl = "https://seriesaddict.fr/programmations";
const weekDate = '2020-03-16';

const fetchData = async (dateParam) => {
    dateParam = dateParam ? dateParam : '';
    const result = await axios.get(`${siteUrl}/${dateParam}`);
    return cheerio.load(result.data);
};

const getList = async (dateParam) => {
    let tmpList = [];
    return await fetchData(dateParam).then(data => {
        data('li.new>a>strong').each((index, item) => {
            tmpList.push(item.childNodes.map(node => node.data));
        });
        return tmpList.flat();
    });
};

getList(weekDate).then(newSeasonList => {
    console.log(newSeasonList)
});