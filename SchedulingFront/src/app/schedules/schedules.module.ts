import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  MatCardModule,
  MatDividerModule,
  MatSelectModule,
  MatDialogModule,
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatTableModule,
  MatIconModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatAutocompleteModule,
  MatSliderModule,
  MatSlideToggleModule
} from '@angular/material';
import { TranslatePipeModule } from '../common/pipes/translate/translatePipe.module';
import { PortalOutletDirectiveModule } from '../common/directives/portalOutlet/portalOutlet.module';
import { SchedulesComponent } from './schedules.component';
import { SchedulesRoutingModule } from './schedules-routing.module';
import { CalendarModule } from '../common/components/calendar/calendar.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DisableIfUnauthorizedDirectiveModule } from '../common/directives/disableIfUnauthorized/disableIfUnauthorized.module';
import { ActionComponent } from './action/action.component';
import { LoaderModule } from '../common/components/loader/loader.module';
import { ToasterModule } from '../common/components/toaster/toaster.module';
import { DataGridModule } from '../common/components/dataGrid/dataGrid.module';
import { TimelineSliderModule } from '../common/components/timelineSlider/timelineSlider.module';
import { DetailActionModule } from '../common/components/detailAction/detailAction.module';

@NgModule({
  declarations: [
    SchedulesComponent,
    ActionComponent
  ],
  imports: [
    SchedulesRoutingModule,
    RouterModule,
    TranslatePipeModule,
    MatCardModule,
    MatDividerModule,
    PortalOutletDirectiveModule,
    CalendarModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DisableIfUnauthorizedDirectiveModule,
    MatDialogModule,
    MatButtonModule,
    LoaderModule,
    ToasterModule,
    MatInputModule,
    MatListModule,
    DataGridModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginatorModule,
    TimelineSliderModule,
    MatAutocompleteModule,
    DetailActionModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: []
})
export class SchedulesModule { }
