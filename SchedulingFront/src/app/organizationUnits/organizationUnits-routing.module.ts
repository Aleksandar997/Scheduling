import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { actionEnum } from '../common/enums';
import { OrganizationUnitsComponent } from './organizationUnits.component';

const routes: Routes = [
    {
        path: '',
        component: OrganizationUnitsComponent,
        data: {
            title: 'title_organization_units',
            code: 'organizationUnit',
            url: 'codebook/organizationUnit'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationUnitsRoutingModule {

}

