import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UserService } from '../../../_services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent implements OnChanges {
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  @Output() dropDownChanged = new EventEmitter<number>();

  dropDownSelectionChanged() {
    this.dropDownChanged.emit(this.selectedYear);
    console.log('YEAR SELECTED  ', this.selectedYear);
    console.log('CHART DATA ', this.chartData);
  }

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('FIRST DATASE');
    console.log(this.chartData);
    console.log(this.availableYears);

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: this.months,
      datasets: [
        {
          label: 'New users',
          data: this.chartData,
          fill: true,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.75,

      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  selectedYear: number = new Date().getFullYear();

  @Input() chartData!: number[];
  @Input() availableYears!: number[];

  data: any;
  options: any;
}
