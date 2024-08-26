import { Component, Input, OnInit } from '@angular/core';
import { utils, write, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent implements OnInit {

  @Input() data;
  @Input() scales;
  @Input() typesOfQUalification;
  processedData = [];
  activate: boolean = false;

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < this.data.length; i++) {
      var student = {}
      student['nombre'] = this.data[i].name;
      student['edad'] = this.data[i].age;
      student['sexo'] = this.data[i].sex;
      student['institución'] = this.data[i].institution[0];
      student['tipoInstitucion'] = this.data[i].type[0];
      student['zonaResidencia'] = this.data[i].residenceSector;

      for (let m = 0; m < this.data[i].resultsCodeScale.length; m++) {
        var scaleWithCode = this.getIndexScale(this.data[i].resultsCodeScale[m]);
        var answerForm = parseInt(this.scales[scaleWithCode].answerForm);
        var indexCodeType;
        for (let p = 0; p < this.typesOfQUalification.length; p++) {
          if (parseInt(this.typesOfQUalification[p].codeType) === answerForm) {
            indexCodeType = p;
          }
        }
        for (let j = 0; j < this.scales[scaleWithCode].questions.length; j++) {
          var valueQuestionsASCII = parseInt(this.data[i].resultsScale[m][j].charCodeAt(0));
          if (this.scales[scaleWithCode].questions[j].typeOfQuestion === 'D') {
            student[(j + 1) + '.' + this.scales[scaleWithCode].questions[j].textQuestion] = valueQuestionsASCII - 97;
          } else {
            student[(j + 1) + '.' + this.scales[scaleWithCode].questions[j].textQuestion] = parseInt(this.typesOfQUalification[indexCodeType].value) - valueQuestionsASCII + 97;
          }
        }
        for (let l = 0; l < this.scales[scaleWithCode].factors.length; l++) {
          student[this.scales[scaleWithCode].factors[l]] = this.data[i].resultsPhases[m][l];
        }
        student[`resultadoTotal-${m + 1}`] = this.data[i].resultsOverallResult[m];
      }
      this.processedData.push(student);
    }
  }

  getIndexScale(codeScale) {
    for (let i = 0; i < this.scales.length; i++) {
      if (codeScale === this.scales[i].codeScale) {
        return i;
      }
    }
  }

  generar() {
    this.activate = false;
    if (this.data.length > 0) {
      const ws_name = 'SomeSheet';
      const wb: WorkBook = { SheetNames: [], Sheets: {} };
      const ws: any = utils.json_to_sheet(this.processedData);
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;
      const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
          view[i] = s.charCodeAt(i) & 0xFF;
        };
        return buf;
      }

      saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'data.xlsx');
    } else {
      this.activate = true;
    }
  }
}
