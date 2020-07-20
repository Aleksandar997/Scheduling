
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { TimelineSliderComponent } from './timelineSlider.component';
import { MatIconModule, MatButtonModule, MatSliderModule, MatSlideToggleModule } from '@angular/material';

@NgModule({
  declarations: [
    TimelineSliderComponent,
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatSlideToggleModule,
    ScrollingModule
  ],
  exports: [TimelineSliderComponent],
  providers: [
  ],
  bootstrap: []
})
export class TimelineSliderModule { }
