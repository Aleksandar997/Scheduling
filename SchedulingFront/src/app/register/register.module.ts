import { NgModule } from '@angular/core';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { MatStepperModule, MatInputModule, MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule } from '@angular/material';
import { LoaderModule } from '../common/components/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipeModule } from '../common/pipes/translate/translatePipe.module';
import { ToasterModule } from '../common/components/toaster/toaster.module';
import { RouterModule } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FileUploadModule } from '../common/components/fileUpload/fileUpload.module';

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports: [
        RegisterRoutingModule,
        MatStepperModule,
        MatInputModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        LoaderModule,
        FormsModule,
        CommonModule,
        TranslatePipeModule,
        ToasterModule,
        ReactiveFormsModule,
        RouterModule,
        FileUploadModule
    ],
    exports: [
        RegisterComponent
    ],
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
    }],
    bootstrap: []
})
export class RegisterModule { }
