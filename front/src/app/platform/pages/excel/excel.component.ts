/*
import { Component, Input, OnInit } from '@angular/core';
import { utils, write, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() scales;
  @Input() typesOfQUalification;
  processedData = [];
  //-yo
  processedInstitutionData = [];
  //
  activate: boolean = false;

  constructor() { }

  ngOnInit(): void {
    //---------------------
    if (!Array.isArray(this.data)) {
      this.data = [this.data];
    }

    if (this.data.length === 0) {
      console.error('Data is not defined or empty ngOninit Excel');
      return;
    }

    //this.processStudentData();
    //this.processInstitutionData(); // Procesar datos por institución

    //---------
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
        student[`resultadoTotal de la${this.scales[scaleWithCode].title}`] = this.data[i].resultsOverallResult[m];
        console.log(this.scales);
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
    //
    console.log(this.data);
    if (!this.data || this.data.length === 0) {
      console.error("Data is not defined or empty");
      this.activate = true;
      return;
    }
    if (!Array.isArray(this.data)) {
      console.error("Data is not an array");
      this.activate = true;
      return;
    }
    console.log(this.data);


    //
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

*/
//

import { Component, Input, OnInit } from '@angular/core';
import { utils, write, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() scales: any[];
  @Input() typesOfQUalification: any[];
  processedData = [];
  activate: boolean = false;
  studentData: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.fillStudentData();
     console.log("Received data:", this.data);  // Verificar si se recibe data
    if (!Array.isArray(this.data)) {
      this.data = [this.data];
    }
    
    if (this.data.length === 0) {
      console.error('Data is not defined or empty in ngOnInit Excel');
      return;
    }

    // Procesar los datos de cada estudiante
    for (let i = 0; i < this.data.length; i++) {
      var studentRow = {
        'Nombre': this.data[i].name,
        'Edad': this.data[i].age,
        'Sexo': this.data[i].sex,
        'Institución': this.data[i].institution[0],
        'Tipo de Institución': this.data[i].type[0],
        'Zona de Residencia': this.data[i].residenceSector
      };

      for (let m = 0; m < this.data[i].resultsCodeScale.length; m++) {
        var scaleWithCode = this.getIndexScale(this.data[i].resultsCodeScale[m]);
        var answerForm = parseInt(this.scales[scaleWithCode].answerForm);
        var indexCodeType;

        for (let p = 0; p < this.typesOfQUalification.length; p++) {
          if (parseInt(this.typesOfQUalification[p].codeType) === answerForm) {
            indexCodeType = p;
          }
        }

        // Agregar preguntas y respuestas
        for (let j = 0; j < this.scales[scaleWithCode].questions.length; j++) {
          var valueQuestionsASCII = parseInt(this.data[i].resultsScale[m][j].charCodeAt(0));
          if (this.scales[scaleWithCode].questions[j].typeOfQuestion === 'D') {
            studentRow[(j + 1) + '.' + this.scales[scaleWithCode].questions[j].textQuestion] = valueQuestionsASCII - 97;
          } else {
            studentRow[(j + 1) + '.' + this.scales[scaleWithCode].questions[j].textQuestion] = parseInt(this.typesOfQUalification[indexCodeType].value) - valueQuestionsASCII + 97;
          }
        }

        // Agregar factores y resultados
        for (let l = 0; l < this.scales[scaleWithCode].factors.length; l++) {
          studentRow[this.scales[scaleWithCode].factors[l]] = this.data[i].resultsPhases[m][l];
        }

        // Agregar el nombre de la escala y el resultado total
        studentRow[`Escala: ${this.scales[scaleWithCode].title}`] = this.data[i].resultsOverallResult[m];
        //console.log(this.scales);
      }

      // Añadir la fila del estudiante al array procesado
      this.processedData.push(studentRow);
    }
  }

  fillStudentData(): void {
    this.studentData.push(this.data); // O alguna transformación de 'data'
    console.log("test" + this.studentData);
    this.processedData.push(this.studentData);
    console.log("test2" + this.processedData);
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
    //
    console.log(this.data);
    if (!this.data || this.data.length === 0) {
      console.error("Data is not defined or empty");
      this.activate = true;
      return;
    }
    if (!Array.isArray(this.data)) {
      console.error("Data is not an array");
      this.activate = true;
      return;
    }
    console.log(this.data);
    
    if (this.processedData.length > 0) {
      const ws_name = 'Resultados Estudiantes';
      const wb: WorkBook = { SheetNames: [], Sheets: {} };
      
      // Crear la hoja desde la lista de estudiantes
      const ws: any = utils.json_to_sheet(this.processedData);
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;
      
      // Convertir a un archivo binario
      const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
          view[i] = s.charCodeAt(i) & 0xFF;
        };
        return buf;
      }

      saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'resultados_estudiantes.xlsx');
    } else {
      this.activate = true;
    }
  }
}


//*\