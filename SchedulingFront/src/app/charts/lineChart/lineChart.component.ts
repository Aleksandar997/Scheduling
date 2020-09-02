import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';
import { ChartBase } from 'src/app/common/base/chartBase';
import { Chart } from 'src/app/models/chart';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { ChartService } from 'src/app/common/services/chart.service';
import { ToasterService } from 'src/app/common/components/toaster/toaster.service';

@Component({
  selector: 'line-chart',
  templateUrl: './lineChart.component.html',
  styleUrls: ['./lineChart.component.css']
})
export class LineChartComponent extends ChartBase<Chart> implements AfterViewInit {
  @ViewChild('loader') loader: LoaderComponent;
  data = [];
  @Input() xAxisLabel;
  @Input() legendTitle;
  @Input() yAxisLabel;

  constructor(private chartService: ChartService<any>) {
    super(chartService);
  }
  ngAfterViewInit() {
    if (!this.showChart) {
      return;
    }
    this.onResize();
    this.loader.show();
    this.chartService.getChart(this.chart).then(res => {
      this.data = res.data.map(d => {
        return {
          name: d.name,
          series: d.barCharts.map(b => {
            return {
              name: b.name,
              value: b.value ? parseFloat(b.value) : 0
            };
          })
        };
      });
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      ToasterService.handleErrors(err, this.chart.insertStringBetweenUpper('_') + '_error');
    });
  }
  
}

