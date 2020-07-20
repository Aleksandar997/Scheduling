import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulesComponent } from './schedules.component';
import { ActionComponent } from './action/action.component';
import { actionEnum } from '../common/enums';

const routes: Routes = [
    {
        path: '',
        component: SchedulesComponent,
        data: {
            title: 'title_schedules'
        }
    },
    {
        path: 'add',
        component: ActionComponent,
        data: {
            title: 'title_add_schedule',
            action: actionEnum.Add
        }
    },
    {
        path: 'view/:id',
        component: ActionComponent,
        data: {
            title: 'title_view_schedule',
            action: actionEnum.View
        }
    },
    {
        path: 'edit/:id',
        component: ActionComponent,
        data: {
            title: 'title_edit_schedule',
            action: actionEnum.Edit
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchedulesRoutingModule {

}

