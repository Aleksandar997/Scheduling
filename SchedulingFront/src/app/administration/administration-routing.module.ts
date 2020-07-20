import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            // {
            //     path: 'roles',
            //     data: {
            //         title: 'title_roles'
            //     },
            //     loadChildren: './roles/roles.module#RolesModule'
            // },
            {
                path: 'users',
                data: {
                    title: 'title_users'
                },
                loadChildren: './users/users.module#UsersModule'
            },
            // {
            //     path: 'translate',
            //     data: {
            //         title: 'title_translate'
            //     },
            //     loadChildren: './translate/translate.module#TranslateModule'
            // }
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
