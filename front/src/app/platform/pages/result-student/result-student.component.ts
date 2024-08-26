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

  visible:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  more() {
    if (this.visible===true) {
      this.visible = false;
    }else{
      this.visible = true;
    }
  }

  getIndex(codeScale){
    for (let i = 0; i < this.scales.length; i++) {
      if (this.scales[i].codeScale===codeScale) {
        return i;
      }
      
    }
  }

  convertString(chain){
    return parseInt(chain);
  }

  typesOfQUalificationSearch(answerForm){
    return this.typesOfQUalification.find(item=>item.codeType===answerForm).value;
  }
}
