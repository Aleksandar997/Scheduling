import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { actionEnum } from 'src/app/common/enums';
import { PasswordChangeComponent } from './passwordChange/passwordChange.component';


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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}

