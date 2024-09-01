import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-result-student',
  templateUrl: './result-student.component.html',
  styleUrls: ['./result-student.component.css']
})
export class ResultStudentComponent implements OnInit {

  @Input() data;
  @Input() scales;
  @Input() typesOfQUalification;
  @Input() index;

  visible: boolean = false;
  //Para poder ordenar la nueva lista
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor() { }

  ngOnInit(): void {
  }

  more() {
    this.visible = !this.visible;
    // if (this.visible===true) {
    //   this.visible = false;
    // }else{
    //   this.visible = true;
    // }
  }

  getIndex(codeScale) {
    for (let i = 0; i < this.scales.length; i++) {
      if (this.scales[i].codeScale === codeScale) {
        return i;
      }

    }
  }

  convertString(chain) {
    return parseInt(chain);
  }

  typesOfQUalificationSearch(answerForm) {
    return this.typesOfQUalification.find(item => item.codeType === answerForm).value;
  }
 
  //función de ordenamiento
  sortStudents(field: string) {
    this.data.sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

      if (field === 'course') {
        valueA = parseInt(valueA);
        valueB = parseInt(valueB);
      }

      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
}
