import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ActionComponent } from './action/action.component';
import { actionEnum } from '../common/enums';

const routes: Routes = [
    {
        path: '',
        component: ProductsComponent,
        data: {
            title: 'title_products'
        }
    },
    {
        path: 'add',
        component: ActionComponent,
        data: {
            title: 'title_add_product',
            action: actionEnum.Add
        }
    },
    {
        path: 'view/:id',
        component: ActionComponent,
        data: {
            title: 'title_view_product',
            action: actionEnum.View
        }
    },
    {
        path: 'edit/:id',
        component: ActionComponent,
        data: {
            title: 'title_edit_product',
            action: actionEnum.Edit
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule {

}

