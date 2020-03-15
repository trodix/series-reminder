import axios from 'axios';
import cheerio from 'cheerio';
import { getNextDayOfWeek } from './utils';
const siteUrl: string = 'https://seriesaddict.fr/programmations';

const fetchData = async (dateParam: string) => {
    dateParam = dateParam ? dateParam : '';
    const result = await axios.get(`${siteUrl}/${dateParam}`);
    return cheerio.load(result.data);
};

const getList = async (dateParam: string) => {
    let tmpList: any = [];
    return await fetchData(dateParam).then(data => {
        data('li.new>a>strong').each((index: number, item: any) => {
            tmpList.push((item.childNodes).map((node: any) => node.data));
        });
        return tmpList.flat();
    });
};

export const checkForNewSeries = () => {
    const today: Date = new Date();
    const nextMonday: Date = getNextDayOfWeek(today, 1); // 1: Monday
    const nextWeekDate: string = nextMonday.toISOString().split('T')[0]; // yyyy-mm-dd
    console.log(nextWeekDate);

    getList(nextWeekDate).then((newSeasonList: Array<string>) => {
        console.log(newSeasonList)
    });
}
