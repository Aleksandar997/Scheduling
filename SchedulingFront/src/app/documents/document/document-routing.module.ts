import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentComponent } from './document.component';
import { ActionComponent } from './action/action.component';
import { actionEnum } from 'src/app/common/enums';

const routes: Routes = [
    {
        path: '',
        component: DocumentComponent,
        data: {
          title: 'title_document'
        },
    },
    {
        path: 'add',
        component: ActionComponent,
        data: {
            title: 'title_add_document',
            action: actionEnum.Add
        }
    },
    {
        path: 'view/:id',
        component: ActionComponent,
        data: {
            title: 'title_view_document',
            action: actionEnum.View
        }
    },
    {
        path: 'edit/:id',
        component: ActionComponent,
        data: {
            title: 'title_edit_document',
            action: actionEnum.Edit
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentRoutingModule {

}

