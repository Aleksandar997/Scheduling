import { NgModule } from '@angular/core';
import { MatDialogModule, MatButtonModule, MatDividerModule } from '@angular/material';
import { ConfirmationModalComponent } from './confirmationModal.component';
import { TranslatePipeModule } from '../../pipes/translate/translatePipe.module';
import { LoaderModule } from '../../components/loader/loader.module';
import { ToasterModule } from '../../components/toaster/toaster.module';


@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatDividerModule,
        LoaderModule,
        ToasterModule,
        TranslatePipeModule
    ],
    declarations: [
        ConfirmationModalComponent
    ],
    exports: [ConfirmationModalComponent]
})
export class ConfirmationModalModule { }
