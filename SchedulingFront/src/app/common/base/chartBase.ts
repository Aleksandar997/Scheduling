import { Input, OnInit } from '@angular/core';
import { ChartService } from '../services/chart.service';
import { LocalData } from '../data/localData';
import { ChartMetaData } from '../models/chartMetaData';
import { ChartCacheService } from 'src/app/charts/chartCache.service';

export abstract class ChartBase<T> implements OnInit {
    view;
    @Input() chart;
    @Input() grouped = false;
    groupedView;
    chartMetaData: ChartMetaData;
    chartPosition;
    showChart = true;
    constructor(private service: ChartService<T>) {


    }
    ngOnInit() {
        this.chartMetaData = ChartCacheService.getChartData(this.chart);
        if (!this.chartMetaData) {
            this.showChart = false;
            return;
        }
        this.chartPosition = {
            x: this.chartMetaData.x,
            y: this.chartMetaData.y
        };
    }
    dropped(e) {
        this.chartMetaData.x += e.distance.x;
        this.chartMetaData.y += e.distance.y;
        LocalData.setChartMetaData(this.chartMetaData);
        this.service.updatePosition(this.chartMetaData);
    }
    onResize() {
        const card = document.getElementById('card');
        if (this.grouped) {
            this.view =
                [
                    card.clientWidth / 1.1,
                    card.clientHeight / 1.5
                ];
            return;
        }
        this.view =
            [
                card.clientWidth <= 533 ? card.clientWidth / 1.2 : card.clientWidth / 2.20,
                card.clientHeight / 2.20
            ];
    }
}
