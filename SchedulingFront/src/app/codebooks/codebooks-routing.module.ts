import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodebooksComponent } from './codebooks.component';

const routes: Routes = [
    {
        path: 'documenttypes',
        component: CodebooksComponent,
        data: {
          title: 'title_document_types',
          code: 'documentType',
          url: 'codebook/documentType'
        },
    },
    {
        path: 'producttypes',
        component: CodebooksComponent,
        data: {
          title: 'title_product_types',
          code: 'productType',
          url: 'codebook/productType'
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CodebooksRoutingModule {

}

