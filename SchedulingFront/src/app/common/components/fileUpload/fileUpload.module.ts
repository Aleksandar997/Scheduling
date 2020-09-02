import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatCardModule } from '@angular/material';
import { FileUploadComponent } from './fileUpload.component';
import { ProgressLoaderModule } from '../progressLoader/progressLoader.module';

@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        ProgressLoaderModule
    ],
    declarations: [
        FileUploadComponent
    ],
    exports: [FileUploadComponent]
})
export class FileUploadModule { }
