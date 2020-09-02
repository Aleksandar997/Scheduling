import { NgModule } from '@angular/core';
import { ModalBaseComponent } from './modalBase.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationModalModule } from '../confirmationModal/confirmationModal.module';
import { ConfirmationModalComponent } from '../confirmationModal/confirmationModal.component';
import { CustomerActionModalComponent } from 'src/app/modals/customer-action-modal/customerActionModal.component';
import { CustomerActionModalModule } from 'src/app/modals/customer-action-modal/customerActionModal.module';
import { ModalFactoryComponent } from './modalFactory/modalFactory.component';
import { TranslatePipeModule } from '../../pipes/translate/translatePipe.module';
import { MatDialogModule } from '@angular/material';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoaderModule } from '../../components/loader/loader.module';
import { ToasterModule } from '../../components/toaster/toaster.module';
import { CodebookEditModule } from '../codebookEdit/codebookEdit.module';
import { CodebookEditComponent } from '../codebookEdit/CodebookEdit.component';
// import { ModalFactoryModule } from './modalFactory/modalFactory.module';

@NgModule({
    imports: [
        ConfirmationModalModule,
        CustomerActionModalModule,
        CommonModule,
        FormsModule,
        TranslatePipeModule,
        MatDialogModule,
        LoaderModule,
        ToasterModule,
        CodebookEditModule
        // ModalFactoryModule
    ],
    declarations: [
        ModalBaseComponent,
        ModalFactoryComponent
    ],
    entryComponents: [
        ConfirmationModalComponent,
        CustomerActionModalComponent,
        ModalFactoryComponent,
        CodebookEditComponent
    ],
    exports: [ModalBaseComponent]
})
export class ModalBaseModule { }
