import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LoaderModule } from '../common/components/loader/loader.module';
import { BarChartComponent } from './barChart/barChart.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslatePipeModule } from '../common/pipes/translate/translatePipe.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LineChartComponent } from './lineChart/lineChart.component';


@NgModule({
  declarations: [
    BarChartComponent,
    LineChartComponent
  ],
  imports: [
    NgxChartsModule,
    LoaderModule,
    DragDropModule,
    TranslatePipeModule,
    // BrowserModule,
    FormsModule,
    // BrowserAnimationsModule
  ],
  exports: [
    BarChartComponent,
    LineChartComponent
  ],
  providers: [],
  bootstrap: []
})
export class ChartsModule { }
