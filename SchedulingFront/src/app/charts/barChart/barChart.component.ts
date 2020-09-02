import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';
import { ChartBase } from 'src/app/common/base/chartBase';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { ChartService } from 'src/app/common/services/chart.service';
import { ToasterService } from 'src/app/common/components/toaster/toaster.service';
import { Chart } from 'src/app/models/chart';

@Component({
  selector: 'bar-chart',
  templateUrl: './barChart.component.html',
  styleUrls: ['./barChart.component.css']
})
export class BarChartComponent extends ChartBase<Chart> implements AfterViewInit {
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
      if (this.grouped) {
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
        return;
      }
      this.data = res.data.map(d => {
        return {
          name: d.name,
          value: d.value
        }
      });
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      ToasterService.handleErrors(err, this.chart.insertStringBetweenUpper('_') + '_error');
    });
  }
}
