import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppLayoutComponent } from './common/layout/appLayout/appLayout.component';
import { AuthGuard } from './common/guards/auth.guard';
import { ForgottenPasswordComponent } from './login/forgottenPassword/forgottenPassword.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'forgotpassword',
    component: ForgottenPasswordComponent
  },
  {
    path: '',
    component: AppLayoutComponent, canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [
      {
        path: 'home',
        loadChildren: './home/home.module#HomeModule'
      },
      {
        path: 'schedules',
        loadChildren: './schedules/schedules.module#SchedulesModule'
      },
      {
        path: 'documents',
        // data: { shouldReuse: true },
        loadChildren: './documents/documents.module#DocumentsModule'
      },
      {
        path: 'products',
        // data: { shouldReuse: true },
        loadChildren: './products/products.module#ProductsModule'
      },
    //   {
    //     path: 'documents',
    //     loadChildren: './documents/documents.module#DocumentsModule'
    //   },
     ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
