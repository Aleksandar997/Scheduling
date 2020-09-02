import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppLayoutComponent } from './common/layout/appLayout/appLayout.component';
import { AuthGuard } from './common/guards/auth.guard';
import { ForgottenPasswordComponent } from './login/forgottenPassword/forgottenPassword.component';
import { RegisterComponent } from './register/register.component';


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
    path: 'registration',
    component: RegisterComponent
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
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'schedules',
        loadChildren: () => import('./schedules/schedules.module').then(m => m.SchedulesModule)
      },
      {
        path: 'documents',
        // data: { shouldReuse: true },
        loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule)
      },
      {
        path: 'products',
        // data: { shouldReuse: true },
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'organizationunits',
        // data: { shouldReuse: true },
        loadChildren: () => import('./organizationUnits/organizationUnits.module').then(m => m.OrganizationUnitsModule)
        // loadChildren: './codebooks/codebooks.module#CodebooksModule'
      },
      {
        path: 'administration',
        // data: { shouldReuse: true },
        loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
      },
      {
        path: 'codebooks',
        // data: { shouldReuse: true },
        loadChildren: () => import('./codebooks/codebooks.module').then(m => m.CodebooksModule)
      },
      {
        path: 'companysettings',
        // data: { shouldReuse: true },
        loadChildren: () => import('./companySettings/companySettings.module').then(m => m.CompanySettingsModule)
      },
      {
        path: 'customers',
        // data: { shouldReuse: true },
        loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
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
