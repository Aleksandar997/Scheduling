import { NgModule } from '@angular/core';
import {
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatExpansionModule
} from '@angular/material';
import { LoaderModule } from 'src/app/common/components/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipeModule } from 'src/app/common/pipes/translate/translatePipe.module';
import { RouterModule } from '@angular/router';
import { PortalOutletDirectiveModule } from 'src/app/common/directives/portalOutlet/portalOutlet.module';
import { ModalBaseModule } from 'src/app/common/modals/modalBase/modalBase.module';
import { ActionComponent } from './action/action.component';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { CodebookBaseModule } from 'src/app/common/components/codebookBase/codebookBase.module';
import { TreeViewModule } from 'src/app/common/components/treeView/treeView.module';

@NgModule({
    imports: [
        RolesRoutingModule,
        CodebookBaseModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        CommonModule,
        TranslatePipeModule,
        // ToasterModule,
        ReactiveFormsModule,
        RouterModule,
        PortalOutletDirectiveModule,
        // DataGridModule,
        // MatTableModule,
        // MatPaginatorModule,
        MatTooltipModule,
        MatDialogModule,
        MatCheckboxModule,
        // MatSelectModule,
        ModalBaseModule,
        TreeViewModule,
        MatExpansionModule
        // MatSortModule
    ],
    declarations: [RolesComponent, ActionComponent]
})
export class RolesModule { }
