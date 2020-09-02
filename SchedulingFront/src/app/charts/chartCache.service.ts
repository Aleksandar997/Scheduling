import { ChartMetaData } from '../common/models/chartMetaData';

export class ChartCacheService {
    private static chartMetaData = new Map<string, ChartMetaData>();
    static set(chartMetaData: Array<ChartMetaData>) {
        chartMetaData.forEach(c => this.chartMetaData.set(c.name, c));
    }
    static getChartData = (chartName: string) => ChartCacheService.chartMetaData.get(chartName);
}
