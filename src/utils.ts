/**
 * Returns the date of the next day. If today is friday and we are asking for next friday the friday of the next week is returned.
 * @param date The date to start with
 * @param dayOfWeek 0:Su,1:Mo,2:Tu,3:We,4:Th,5:Fr,6:Sa
 */
export const getNextDayOfWeek = (date: Date, dayOfWeek: number): Date => {
    let resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay() - 1) % 7 +1);
    return resultDate;
};
