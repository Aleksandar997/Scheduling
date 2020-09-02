import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatBadgeModule,
  MatTableModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatSortModule
} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { SchedulesRoutingModule } from 'src/app/schedules/schedules-routing.module';
import { TranslatePipeModule } from '../../pipes/translate/translatePipe.module';
import { PortalOutletDirectiveModule } from '../../directives/portalOutlet/portalOutlet.module';
import { ModalBaseModule } from '../../modals/modalBase/modalBase.module';
import { LoaderModule } from '../loader/loader.module';
import { ToasterModule } from '../toaster/toaster.module';
import { DataGridModule } from '../dataGrid/dataGrid.module';
import { DayDetailsComponent } from './dayDetails/dayDetails.component';
import { TimelineSliderModule } from '../timelineSlider/timelineSlider.module';
// import { CalendarModule as C } from "ion2-calendar";

@NgModule({
  declarations: [
    CalendarComponent,
    DayDetailsComponent
  ],
  imports: [
    SchedulesRoutingModule,
    RouterModule,
    TranslatePipeModule,
    MatCardModule,
    MatDividerModule,
    PortalOutletDirectiveModule,
    MatGridListModule,
    FormsModule,
    CommonModule,
    ModalBaseModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    LoaderModule,
    ToasterModule,
    MatInputModule,
    MatBadgeModule,
    DataGridModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    TimelineSliderModule,
    MatSortModule
  ],
  exports: [CalendarComponent],
  providers: [
  ],
  bootstrap: []
})
export class CalendarModule { }
