import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';
import { LoaderComponent } from './loader.component';

@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        LoaderComponent
    ],
    exports: [LoaderComponent]
})
export class LoaderModule { }
