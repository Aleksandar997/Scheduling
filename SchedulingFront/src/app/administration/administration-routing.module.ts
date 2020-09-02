import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'roles',
                data: {
                    title: 'title_roles'
                },
                loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
            },
            {
                path: 'users',
                data: {
                    title: 'title_users'
                },
                loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
            },
            {
                path: 'translates',
                data: {
                    title: 'title_translates'
                },
                loadChildren: () => import('./translates/translates.module').then(m => m.TranslatesModule)
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdministrationRoutingModule { }
