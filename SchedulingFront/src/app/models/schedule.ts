import { BasePaging } from '../common/models/basePaging';
import { IDayDetail } from '../common/components/calendar/base/dayDetail';
import { Employee } from './employee';
import { Customer } from './customer';

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

export class CalendarPaging {
    dateFrom: Date;
    dateTo: Date;
    filter: any;

    constructor(dateFrom: Date = null, dateTo: Date = null) {
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }
}


export class ScheduleOnDayPaging extends BasePaging {
    date: Date;
}
