import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: ':code',
                // data: { shouldReuse: true },
                loadChildren: './document/document.module#DocumentModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentsRoutingModule {

}

