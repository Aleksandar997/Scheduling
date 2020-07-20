import { IDayDetail } from '../components/calendar/base/dayDetail';

export class Day {
    color: string;
    day: number;
    currentMonth: boolean;
    isToday: boolean;
    date: Date;
    month: number;
    details: Array<IDayDetail> = [];
    constructor(day: number, month: number, date: Date, activeMonth: number) {
        const currDate = new Date();
        this.day = day;
        this.month = month;
        this.currentMonth = date.getMonth() === activeMonth;
        this.date = date;
        this.isToday = date != null && date.getDate() === currDate.getDate() && date.getMonth() === currDate.getMonth();
    }
}
