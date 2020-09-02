import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { MatSlider } from '@angular/material';

let TimelineSliderValue;
@Component({
  selector: 'timeline-slider',
  templateUrl: './timelineSlider.component.html',
  styleUrls: ['./timelineSlider.component.css']
})
export class TimelineSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('slider') slider: MatSlider;
  @Input() date: Date;
  @Input() disabled = false;
  // value = () => {
  //   const val = this.slider.value.toString().split('.');
  //   if (val.length === 2) {
  //     const num = (+('.' + Math.round(+val[1] / 10 * 6))).toFixed(2);
  //     return +val[0] + +num;
  //   }
  //   return this.slider.value;
  // }
  value = () => TimelineSliderValue;
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
  }
  formatLabel(value: number) {
    if (!value) {
      return 0;
    }
    const mm = (+value.toString().replace(/^[^\.]+/, '0')) * 60;
    const mmPart = mm.toString().length === 1 ? '0' + mm.toString() : mm.toString();
    let hhPart;
    if (value >= 0) {
      const strArr = value.toFixed(2).split('.');
      if (strArr[0].length === 1) {
        strArr[0] = '0' + strArr[0];
      }
      hhPart = strArr[0];
    }
    const d = new Date();
    d.setUTCHours(+mmPart > 59 ? +hhPart - 1 : +hhPart, Math.round(+mmPart));
    const minutes = d.getMinutes();
    const hours = d.getUTCHours();
    TimelineSliderValue =
      (hours.toString().length === 1 ? '0' + hours : hours) +
      ':' +
      (minutes.toString().length === 1 ? '0' + minutes : minutes);
    return TimelineSliderValue;
  }
  getTime(date: Date, e: MatSlider) {
    if (e.value) {
      return e.value;
    }
    const d = new Date(date);
    return +(d.getHours() + '.' + Math.round(d.getMinutes() * 10 / 6));
  }
  test(event) {
    const val = event.value.toFixed(2).toString().split('.');
  }
  decreaseTime() {

  }
  increaseTime() {
    const val = this.slider.value.toString().split('.');
    if (val.length === 2) {
      const num = (+('.' + Math.round(+val[1] / 10 * 6))).toFixed(2);
      // console.log(+val[0] + +num + 0.01)
      this.slider.writeValue(+val[0] + +num + 0.01);
    }
    // console.log(+this.slider.value + 0.01);
    // if (val.length === 1) {
    //   console.log(val)
    //   this.slider.writeValue(+(val[0] + '.' + '01'));
    //   console.log(+(val[0] + '.' + '01'))
    //   return;
    // }
    // console.log(+(val[0] + '.' + (+val[1] + 0.01)))
    // this.slider.writeValue(+(val[0] + '.' + (+val[1] + 0.01)));
  }
}
