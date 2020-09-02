import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { actionEnum } from 'src/app/common/enums';
import { PasswordChangeComponent } from './passwordChange/passwordChange.component';
import { ActionComponent } from './action/action.component';


const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    data: {
      title: 'users_breadcrumb'
    }
  },
  {
    path: 'passwordchange/:id/:isAdmin',
    component: PasswordChangeComponent,
    data: {
      title: 'title_password_change',
      action: actionEnum.View
    }
  },
  {
    path: 'add',
    component: ActionComponent,
    data: {
        title: 'title_add_user',
        action: actionEnum.Add
    }
},
{
    path: 'view/:id',
    component: ActionComponent,
    data: {
        title: 'title_view_user',
        action: actionEnum.View
    }
},
{
    path: 'edit/:id',
    component: ActionComponent,
    data: {
        title: 'title_edit_user',
        action: actionEnum.Edit
    }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}

