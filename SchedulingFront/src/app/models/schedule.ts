import { BasePaging } from '../common/models/basePaging';
import { IDayDetail } from '../common/components/calendar/base/dayDetail';
import { Employee } from './employee';
import { Customer } from './customer';
import { CalendarPaging } from '../common/models/calendarPaging';

export class Schedule implements IDayDetail {
    id: number;
    scheduleId: number;
    customerId: number;
    customer: Customer = new Customer();
    customerName: string;
    phoneNumber: string;
    date: Date;
    employeeId: number;
    employee: Employee;
    employees: string;
    bindToEmployee: boolean;
    constructor() {
        this.scheduleId = null;
        this.customer = null;
        this.phoneNumber = null;
        this.date = null;
        this.customerName = null;
        this.employees = null;
    }

    static init(schedule: Schedule) {
        const sch = new Schedule();
        Object.keys(sch).forEach(element => {
            sch[element] = schedule[element];
        });
        sch.id = schedule.scheduleId;
        return sch;
    }
}

// export class ScheduleMap {
//     schedule: Schedule;
// }

export class SchedulePaging extends CalendarPaging {
    dateFrom: Date;
    dateTo: Date;
    filter: any;
    employees = new Array<number>();
    organizationUnits = new Array<number>();

    setCalendarDate(calendarPaging: CalendarPaging) {
        this.dateFrom = calendarPaging.dateFrom;
        this.dateTo = calendarPaging.dateTo;
    }
}


export class ScheduleOnDayPaging extends BasePaging {
    date: Date;
}
