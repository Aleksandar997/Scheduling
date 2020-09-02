import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material';

@Component({
  selector: 'progress-loader',
  templateUrl: './progressLoader.component.html'
})
export class ProgressLoaderComponent implements OnInit {
  @ViewChild(MatProgressBar) matProgressBar: MatProgressBar;
  constructor() { }

  ngOnInit() {
  }

  show() {
    this.matProgressBar.mode = 'indeterminate';
  }

  close() {
    this.matProgressBar.mode = 'determinate';
  }

  timedClose(onClose: () => any, timeout = 2000) {
    setTimeout(() => {
      this.matProgressBar.mode = 'determinate';
      onClose();
    }, timeout);
  }
}
