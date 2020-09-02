import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles.component';
import { ActionComponent } from './action/action.component';
import { actionEnum } from 'src/app/common/enums';


const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
    data: {
      title: 'roles_breadcrumb',
      code: 'role',
      url: 'role'
    }
  },
  {
    path: 'add',
    component: ActionComponent,
    data: {
        title: 'title_add_role',
        action: actionEnum.Add
    }
},
{
    path: 'view/:id',
    component: ActionComponent,
    data: {
        title: 'title_view_role',
        action: actionEnum.View
    }
},
{
    path: 'edit/:id',
    component: ActionComponent,
    data: {
        title: 'title_edit_role',
        action: actionEnum.Edit
    }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {
}

