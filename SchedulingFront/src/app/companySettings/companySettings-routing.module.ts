import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanySettingsComponent } from './companySettings.component';

const routes: Routes = [
    {
        path: '',
        component: CompanySettingsComponent,
        data: {
            title: 'title_company'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanySettingsRoutingModule {
}

