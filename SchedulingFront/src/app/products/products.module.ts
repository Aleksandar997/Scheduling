import { NgModule } from '@angular/core';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { TranslatePipeModule } from '../common/pipes/translate/translatePipe.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatTooltipModule, MatInputModule, MatIconModule, MatButtonModule, MatDialogModule, MatCheckboxModule, MatSelectModule, MatFormFieldModule, MatSortModule } from '@angular/material';
import { PortalOutletDirectiveModule } from '../common/directives/portalOutlet/portalOutlet.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DisableIfUnauthorizedDirectiveModule } from '../common/directives/disableIfUnauthorized/disableIfUnauthorized.module';
import { DataGridModule } from '../common/components/dataGrid/dataGrid.module';
import { ToasterModule } from '../common/components/toaster/toaster.module';
import { LoaderModule } from '../common/components/loader/loader.module';
import { ActionComponent } from './action/action.component';
import { ModalBaseModule } from '../common/modals/modalBase/modalBase.module';


@NgModule({
    declarations: [
        ProductsComponent,
        ActionComponent
    ],
    imports: [
        ProductsRoutingModule,
        RouterModule,
        TranslatePipeModule,
        MatCardModule,
        PortalOutletDirectiveModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DisableIfUnauthorizedDirectiveModule,
        DataGridModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatInputModule,
        ToasterModule,
        LoaderModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatCheckboxModule,
        MatSelectModule,
        MatFormFieldModule,
        ModalBaseModule,
        MatSortModule
    ],
    providers: [],
    bootstrap: []
})
export class ProductsModule { }
