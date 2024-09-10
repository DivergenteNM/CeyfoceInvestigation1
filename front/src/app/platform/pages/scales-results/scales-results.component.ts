import { Component, OnInit, Input } from '@angular/core';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-scales-results',
  templateUrl: './scales-results.component.html',
  styleUrls: ['./scales-results.component.css']
})
export class ScalesResultsComponent implements OnInit {
 //-----------------------------------------------------------yo
  @Input() data = [];  // Lista de estudiantes
  //
  currentSortField: string = '';
  sortDirection: boolean = true; // true: ascendente, false: descendente
  sortStudents(field: string) {
    if (!this.data || this.data.length === 0) {
      console.error('No hay datos para ordenar');
      return;
    }

    if (this.currentSortField === field) {
      this.sortDirection = !this.sortDirection; // Cambia la dirección del ordenamiento si es el mismo campo
    } else {
      this.currentSortField = field;
      this.sortDirection = true; // Ordena ascendentemente por defecto
    }

    this.data.sort((a, b) => {
      let valueA, valueB;

      switch (field) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'institution':
          valueA = a.institution[0].toLowerCase();
          valueB = b.institution[0].toLowerCase();
          break;
        case 'course':
          valueA = a.course;
          valueB = b.course;
          break;
        case 'scalesSum':
          valueA = this.sumScales(a.resultsOverallResult);
          valueB = this.sumScales(b.resultsOverallResult);
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return this.sortDirection ? -1 : 1;
      if (valueA > valueB) return this.sortDirection ? 1 : -1;
      return 0;
    });
  }

  sumScales(scalesArray: number[]): number {
    return scalesArray.reduce((acc, curr) => acc + curr, 0);
  }

  //============================

  convertString(chain: string): number {
    return parseInt(chain);
  }

  activateButtons: boolean = false;
  activateGraph: boolean = false;
  activateExcel: boolean = true;//
  activateResume: boolean = true;
  loading: boolean = false;
  activateAverageScaleInstitutions: boolean = false;
  institutionOrScale: boolean = true;
  studentResults: any = [];
  studentsResultsAux: any = [];
  scales: any = [];
  typesOfQUalification: any = [];
  scalesFilter = [];

  totalAverageScale: number[] = [];
  factorsScales = [];

  nameOfInstitutions = [];
  totalAverageScaleInstitution = [];
  factorsScaleInstitution = [];
  numberOfStudents = [];

  messageActivate: boolean = false;
  messageTitle: string = '';
  messageInfo: string = '';
  messageButton: boolean = true;

  constructor(private platformService: PlatformService) { }

  ngOnInit(): void {
    //no lo veo necesario después del header
    // if (this.scalesFilter.length === 0) {
    //   this.showMessage('Debe seleccionar al menos una escala en el filtro para ver resultados', '');
    // }
    this.platformService.getScalesResults()
      .subscribe(res => {
        this.scales = res.scaleResults;
        this.typesOfQUalification = res.typesOfQualification;
        for (let i = 0; i < res.scaleResults.length; i++) {
          this.totalAverageScale.push(0);
        }
        var arrayAux = [];
        for (let i = 0; i < res.scaleResults.length; i++) {
          arrayAux = [];
          for (let j = 0; j < this.scales[i].factors.length; j++) {
            arrayAux.push(0);
          }
          this.factorsScales.push(arrayAux); //esto no es la lista de usuarios
        }
      })

  }

  showMessage(title: string, info: string) {
    this.messageTitle = title;
    this.messageInfo = info;
    this.messageActivate = true;
  }

  closeAlert() {
    this.messageActivate = false;
  }

  buttonSend() {
    this.activateButtons = false;
    this.activateGraph = false;
    this.activateExcel = true;
    // this.activateResume = true;

    var flagInstitutions = false;
    var filterElements = JSON.parse(localStorage.getItem("filterElements"));
    let contFilt = 0;
    try {
      for (let i = 0; i < filterElements.length; i++) {
        if (filterElements[i].name === "Escalas" && filterElements[i].options.length > 0) {
          for (let q = 0; q < filterElements[i].options.length; q++) {
            if (filterElements[i].options[q].checked === true) {
              contFilt++;
            }
          }
          break;
        }
      }
    } catch (error) {
    }

    if (filterElements === null || contFilt === 0) {
      this.messageActivate = true;
      this.messageTitle = "Advertencia";
      this.messageInfo = "Es necesario que seleccione al menos una escala en el filtro arriba a la izquierda"
      this.messageButton = true;
    } else {
      this.loading = true;
      this.nameOfInstitutions = [];
      this.totalAverageScaleInstitution = [];
      this.numberOfStudents = [];
      this.factorsScaleInstitution = [];
      this.scalesFilter = [];
      const admissibleness = localStorage.getItem('admissibleness');
      if (admissibleness === '6465asd7#asd-1' || admissibleness === '8435dpe1+nrs-3') {
        this.activateAverageScaleInstitutions = true;
      }

      if (filterElements === null || filterElements === undefined) {
        filterElements = [];
      }
      for (let i = 0; i < this.scales.length; i++) {
        for (let j = 0; j < this.scales[i].factors.length; j++) {
          this.factorsScales[i][j] = 0;
        }
      }
      for (let p = 0; p < filterElements.length; p++) {
        if (filterElements[p].name === "Instituciones" && filterElements[p].options.length > 0) {
          for (let q = 0; q < filterElements[p].options.length; q++) {
            if (filterElements[p].options[q].checked === true) {
              this.nameOfInstitutions.push(filterElements[p].options[q].name);//da el nombree de las instituciones que salen
            }
          }
          if (this.nameOfInstitutions.length !== 0) {
            flagInstitutions = true;
            this.fillInstitutionsAndFactors(this.nameOfInstitutions);
          }
          break;
        }
      }
      this.platformService.getResults(filterElements)
        .subscribe(res => {
          this.activateResume = true;
          var flag = false;
          const arrayFilter = JSON.parse(localStorage.getItem('filterElements'));
          if (arrayFilter !== null) {
            for (let e = 0; e < arrayFilter.length; e++) {
              if (arrayFilter[e].name === 'Escalas') {
                const scales = arrayFilter[e];
                for (let f = 0; f < scales.options.length; f++) {
                  if (scales.options[f].checked === true) {
                    flag = true;
                    this.scalesFilter.push(scales.options[f].name); //aqui da las escalas que hay en el filtro, ejemplo escala de violencia, escala de estres, etc
                  }
                }
              }
            }
          }

          if (flag === true) {
            for (let u = 0; u < res.studentResults.length; u++) {
              for (let w = 0; w < res.studentResults[u].resultsTitleScale.length; w++) {
                var nameScale = res.studentResults[u].resultsTitleScale[w];
                if (this.verifyScaleFilter(nameScale) === false) {
                  res.studentResults[u].resultsTitleScale.splice(w, 1);
                  res.studentResults[u].resultsOverallResult.splice(w, 1);
                  res.studentResults[u].resultsPhases.splice(w, 1);
                  res.studentResults[u].resultsScale.splice(w, 1);
                  res.studentResults[u].resultsCodeScale.splice(w, 1);
                  w--;
                }
              }
            }
          }

          this.studentResults = res.studentResults;
          this.loading = false;
          var acum1 = 0.0;
          var cont = 0;
          var obj = {};
          if (!flagInstitutions) {
            for (let index = 0; index < res.studentResults.length; index++) {
              obj[res.studentResults[index].institution[0]] = "";
            }
            this.fillInstitutionsAndFactors(Object.keys(obj));
          }
          for (let a = 0; a < this.nameOfInstitutions.length; a++) {
            for (let b = 0; b < res.studentResults.length; b++) {
              if (res.studentResults[b].institution[0] === this.nameOfInstitutions[a]) {
                this.numberOfStudents[a]++;
                cont++;
              }
            }
          }
          for (let i = 0; i < this.scales.length; i++) {
            acum1 = 0.0;
            for (let j = 0; j < res.studentResults.length; j++) {
              for (let k = 0; k < res.studentResults[j].resultsCodeScale.length; k++) {
                if (res.studentResults[j].resultsCodeScale[k] === this.scales[i].codeScale) {
                  for (let l = 0; l < this.nameOfInstitutions.length; l++) {
                    if (res.studentResults[j].institution[0] === this.nameOfInstitutions[l]) {
                      this.totalAverageScaleInstitution[l][i] = this.totalAverageScaleInstitution[l][i] + parseFloat(res.studentResults[j].resultsOverallResult[k]);

                      for (let p = 0; p < res.studentResults[j].resultsPhases[k].length; p++) {
                        this.factorsScaleInstitution[l][i][p] = this.factorsScaleInstitution[l][i][p] + parseFloat(res.studentResults[j].resultsPhases[k][p]);
                      }
                      break;
                    }
                  }
                  acum1 = acum1 + parseFloat(res.studentResults[j].resultsOverallResult[k]);
                  for (let m = 0; m < res.studentResults[j].resultsPhases[k].length; m++) {
                    this.factorsScales[i][m] = this.factorsScales[i][m] + parseFloat(res.studentResults[j].resultsPhases[k][m]);
                  }
                }
              }
            }
            if (acum1 !== 0) {
              this.totalAverageScale[i] = acum1 / cont;
            }
            if (cont !== 0) {
              for (let n = 0; n < this.factorsScales[i].length; n++) {
                this.factorsScales[i][n] = this.factorsScales[i][n] / cont;
              }
            }
          }
          for (let index = 0; index < this.nameOfInstitutions.length; index++) {
            for (let j = 0; j < this.scales.length; j++) {
              this.totalAverageScaleInstitution[index][j] = this.totalAverageScaleInstitution[index][j] / this.numberOfStudents[index];
              for (let k = 0; k < this.scales[j].factors.length; k++) {
                this.factorsScaleInstitution[index][j][k] = this.factorsScaleInstitution[index][j][k] / this.numberOfStudents[index];
              }
            }
          }
        })
    }
  }

  verifyScaleFilter(nameInstitution) {
    for (let i = 0; i < this.scalesFilter.length; i++) {
      if (nameInstitution === this.scalesFilter[i]) {
        return true;
      }
    }
    return false;
  }

  chageViewResults(id) {
    if (id === 1 && this.institutionOrScale === false) {
      this.institutionOrScale = !this.institutionOrScale;
    } else if (id === 2 && this.institutionOrScale === true) {
      this.institutionOrScale = !this.institutionOrScale;
    }
  }

  fillInstitutionsAndFactors(institutions) {
    this.nameOfInstitutions = institutions;
    var arrayAuxAverageScale = [];
    var arrayAuxScaleInstitution = [];
    var arrayAuxFactor = [];
    for (let index = 0; index < this.nameOfInstitutions.length; index++) {
      arrayAuxAverageScale = [];
      arrayAuxScaleInstitution = [];
      for (let jndex = 0; jndex < this.scales.length; jndex++) {
        arrayAuxAverageScale.push(0);
        arrayAuxFactor = [];
        for (let kndex = 0; kndex < this.scales[jndex].factors.length; kndex++) {
          arrayAuxFactor.push(0); //da la media de las escalas en el resumen de puntajes globales
        }
        arrayAuxScaleInstitution.push(arrayAuxFactor);
      }
      this.factorsScaleInstitution.push(arrayAuxScaleInstitution);
      this.totalAverageScaleInstitution.push(arrayAuxAverageScale);
    }
    this.fillNumberStudents(this.nameOfInstitutions.length);
  }

  fillNumberStudents(size) {
    for (let i = 0; i < size; i++) {
      this.numberOfStudents.push(0); //la cantidad de estudiantes que hay
    }
  }

  buttonRight(e) {
    if (this.activateButtons === false) {
      this.activateButtons = true;
    } else {
      this.activateButtons = false;
    }
    return false;
  }



  valueMinMaxDes(arrayValue) {
    var min = arrayValue[0];
    if (min !== undefined) {
      for (let i = 1; i < arrayValue.length; i++) {
        if (min > arrayValue[i]) {
          min = arrayValue[i];
        }
      }
      return min;
    } else {
      return 0;
    }
  }

  download() {
    this.studentsResultsAux = this.studentResults;
    this.studentResults = [];
    this.activateExcel = true;
    this.activateButtons = false;
    this.activateGraph = false;
    this.activateResume = false;
  }
  isSelectedScale(title: string): boolean {
    return this.scalesFilter.includes(title);
  }

  graph() {
    this.studentsResultsAux = this.studentResults;
    this.studentResults = [];
    this.activateGraph = true;
    this.activateExcel = false;
    this.activateButtons = false;
    this.activateResume = false;
  }
}