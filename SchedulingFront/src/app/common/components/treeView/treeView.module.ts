import { NgModule } from '@angular/core';
import { TreeViewComponent } from './treeView.component';
import {
    MatTreeModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule
} from '@angular/material';
import { CdkTreeModule } from '@angular/cdk/tree';
import { FormsModule } from '@angular/forms';
import { TranslatePipeModule } from '../../pipes/translate/translatePipe.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        TreeViewComponent,
    ],
    imports: [
        MatTreeModule,
        CdkTreeModule,
        FormsModule,
        MatIconModule,
        MatCheckboxModule,
        TranslatePipeModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        CommonModule,
        MatSlideToggleModule
    ],
    providers: [],
    bootstrap: [],
    exports: [
        TreeViewComponent
    ],
    entryComponents: []
})
export class TreeViewModule { }
