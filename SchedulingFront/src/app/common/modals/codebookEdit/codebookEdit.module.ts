import { NgModule } from '@angular/core';
import { CodebookEditComponent } from './CodebookEdit.component';
import { MatDialogModule, MatButtonModule, MatDividerModule, MatInputModule, MatCheckboxModule, MatFormFieldModule } from '@angular/material';
import { LoaderModule } from '../../components/loader/loader.module';
import { ToasterModule } from '../../components/toaster/toaster.module';
import { TranslatePipeModule } from '../../pipes/translate/translatePipe.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        CodebookEditComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatDividerModule,
        LoaderModule,
        ToasterModule,
        TranslatePipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatInputModule,
        MatCheckboxModule,
        MatFormFieldModule
    ],
    entryComponents: [

    ],
    exports: [CodebookEditComponent]
})
export class CodebookEditModule { }
