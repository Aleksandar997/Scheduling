import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslatesComponent } from './translates.component';
import { ActionComponent } from './action/action.component';
import { actionEnum } from 'src/app/common/enums';

const routes: Routes = [
    {
        path: '',
        component: TranslatesComponent
    },
    {
        path: 'add',
        component: ActionComponent,
        data: {
            title: 'title_add_translate',
            action: actionEnum.Add
        }
    },
    {
        path: 'view/:id',
        component: ActionComponent,
        data: {
            title: 'title_view_translate',
            action: actionEnum.View
        }
    },
    {
        path: 'edit/:id',
        component: ActionComponent,
        data: {
            title: 'title_edit_translate',
            action: actionEnum.Edit
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TranslatesRoutingModule {
}

