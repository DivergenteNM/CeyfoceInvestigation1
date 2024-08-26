import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-individual-graph',
  templateUrl: './individual-graph.component.html',
  styleUrls: ['./individual-graph.component.css']
})
export class IndividualGraphComponent implements OnInit {

  @Input() horizontal: boolean = false;

  public barChartOptions: ChartOptions = {
    responsive: true
  };
  @Input() barChartLabels: Label[] = [
    // '2006', '2007', '2008', '2009', '2010', '2011', '2012'
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  @Input() series: string[];
  @Input() data:any[];

  dataConv = [];

  barChartData: ChartDataSets[] = this.dataConv;
  // @Input() barChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  // ];

  constructor() {}

  ngOnInit(): void {
    // console.log(this.barChartLabels);
    
    // console.log(this.series[0]);
    
    if(this.horizontal){
      this.barChartType = 'horizontalBar';
    }
    for (let i = 0; i < this.data.length; i++) {
      this.dataConv.push({
        data: this.data[i],
        label: this.series[i],
      });
    }    
  }
}
