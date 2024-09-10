import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
//import 'chartjs-plugin-annotation'; // Importar el plugin
//import annotationPlugin from 'chartjs-plugin-annotation';



@Component({
  selector: 'app-individual-graph',
  templateUrl: './individual-graph.component.html',
  styleUrls: ['./individual-graph.component.css']
})
export class IndividualGraphComponent implements OnInit {

  @Input() horizontal: boolean = false;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    plugins: {
      annotation: {
        annotations: [
          {
            type: 'box',
            yScaleID: 'y-axis-0',
            yMin: 0,
            yMax: 30, // Rango para verde
            backgroundColor: 'rgba(75, 192, 192, 0.25)',
            borderColor: 'rgba(75, 192, 192, 0.5)',
            borderWidth: 1,
          },
          {
            type: 'box',
            yScaleID: 'y-axis-0',
            yMin: 30,
            yMax: 70, // Rango para amarillo
            backgroundColor: 'rgba(255, 206, 86, 0.25)',
            borderColor: 'rgba(255, 206, 86, 0.5)',
            borderWidth: 1,
          },
          {
            type: 'box',
            yScaleID: 'y-axis-0',
            yMin: 70,
            yMax: 100, // Rango para rojo
            backgroundColor: 'rgba(255, 99, 132, 0.25)',
            borderColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 1,
          }
        ]
      }
    }
  };

  @Input() barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  @Input() series: string[];
  @Input() data: any[];

  dataConv = [];

  barChartData: ChartDataSets[] = this.dataConv;

  constructor() {}

  ngOnInit(): void {
    if (this.horizontal) {
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
