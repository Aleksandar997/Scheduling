import { NgModule } from '@angular/core';
import { MatDialogModule, MatButtonModule, MatDividerModule, MatInputModule, MatTooltipModule, MatIconModule } from '@angular/material';
import { CustomerActionModalComponent } from './customerActionModal.component';
import { LoaderModule } from 'src/app/common/components/loader/loader.module';
import { ToasterModule } from 'src/app/common/components/toaster/toaster.module';
import { TranslatePipeModule } from 'src/app/common/pipes/translate/translatePipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        LoaderModule,
        ToasterModule,
        TranslatePipeModule,
        MatButtonModule,
        MatDividerModule,
        FormsModule,
        CommonModule,
        MatInputModule,
        MatTooltipModule,
        MatIconModule,
        ReactiveFormsModule
    ],
    declarations: [
        CustomerActionModalComponent
    ],
    exports: [CustomerActionModalComponent]
})
export class CustomerActionModalModule { }
