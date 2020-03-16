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
    const jsonReponse: any = [];
    const columnHeadings: any[] = [];
    return await fetchData(dateParam).then($ => {

        $('table').each((i, table) => {
            const trList = $(table).find('tr');
            getColHeadings($(trList[0]));
            $(table).find('tr').each(processRow);
        });

        function getColHeadings(headingRow :any) {
            const alreadySeen: any = {};

            $(headingRow).find('td').each((j, cell) => {
                let tr = $(cell).find('span').text().trim();

                if (alreadySeen[tr]) {
                    const suffix = ++alreadySeen[tr];
                    tr = `${tr}_${suffix}`;
                } else {
                    alreadySeen[tr] = 1;
                }

                columnHeadings.push(tr);
            });
        }

        function processRow(i: any, row: any) {

            $(row).find('td').each((j, cell) => {
                const rowData = $(cell).find('ul>li.new>a>strong').text().trim();
                if(rowData) {
                    jsonReponse.push({ day: columnHeadings[j],  serie: rowData});
                }
            });
        }
        const data = [];
        jsonReponse.forEach(item => {
            jsonReponse.forEach(item2 => {
                if (item === item2) {
                    if (data[item.day]) {
                        data[item.day].push({ title: item.serie });
                    } else {
                        data[item.day] = [ { title: item.serie } ];
                    }
                }
            });
        });
        return data;
    });
};

export const checkForNewSeries = async () => {
    const today: Date = new Date();
    const nextMonday: Date = getNextDayOfWeek(today, 1); // 1: Monday
    const nextWeekDate: string = nextMonday.toISOString().split('T')[0]; // yyyy-mm-dd
    return getList(nextWeekDate);
};
