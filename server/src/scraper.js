const axios = require("axios");
const cheerio = require("cheerio");
const { getNextDayOfWeek } = require("./utils");
const siteUrl = "https://seriesaddict.fr/programmations";

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

const checkForNewSeries = () => {
    const today = new Date();
    const nextMonday = getNextDayOfWeek(today, 1); // 1: Monday
    const nextWeekDate = nextMonday.toISOString().split('T')[0]; // yyyy-mm-dd
    console.log(nextWeekDate);

    getList(nextWeekDate).then(newSeasonList => {
        console.log(newSeasonList)
    });
}

module.exports = {
    checkForNewSeries
};