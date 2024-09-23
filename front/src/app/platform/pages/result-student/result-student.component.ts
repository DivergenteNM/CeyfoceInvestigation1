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

  constructor() { }


  getStyle(m: number): any {
    const scaleIndex = this.getIndex(this.data.resultsCodeScale[m]);
    const scale = this.scales[scaleIndex];

    if (!scale) {
      return { 'background-color': '#ff8d00bf' }; // Estilo por defecto
    }

    const baremosNegativo = scale.baremosNegativo;
    const result = this.convertString(this.data.resultsOverallResult[m]);
    const baremosMnIg25 = this.convertString(scale.baremosMnIg25);
    const baremosMyIg75 = this.convertString(scale.baremosMyIg75);

    if (baremosNegativo) {
      if (result <= baremosMnIg25) {
        return { 'background-color': '#217321eb' }; // Color para baremosNegativo con MnIg25
      } else if (result >= baremosMyIg75) {
        return { 'background-color': '#bd2c2ce3' }; // Color para baremosNegativo con MyIg75
      }
      return { 'background-color': '#ff8d00bf' }; // Color default para baremosNegativo
    } else {
      if (result <= baremosMnIg25) {
        return { 'background-color': '#bd2c2ce3' }; // Color para MnIg25 sin baremosNegativo
      } else if (result >= baremosMyIg75) {
        return { 'background-color': '#217321eb' }; // Color para MyIg75 sin baremosNegativo
      }
      return { 'background-color': '#ff8d00bf' }; // Color default sin baremosNegativo
    }
  }

  getQualitativeMessage(m: number): string {
    const scaleIndex = this.getIndex(this.data.resultsCodeScale[m]);
    const scale = this.scales[scaleIndex];
  
    if (!scale) {
      return ''; // Si no hay escala, retorna cadena vacía
    }
  
    const result = this.convertString(this.data.resultsOverallResult[m]);
    const baremosMnIg25 = this.convertString(scale.baremosMnIg25);
    const baremosMyIg75 = this.convertString(scale.baremosMyIg75);
    const baremosNegativo = scale.baremosNegativo;
  
    // Define los mensajes cualitativos
    const cualitativoNegativo = scale.cualitativoNegativo;
    const cualitativoIntermedio = scale.cualitativoIntermedio;
    const cualitativoPositivo = scale.cualitativoPositivo;
  
    // Lógica para determinar qué mensaje mostrar
    if (baremosNegativo) {
      if (result <= baremosMnIg25) {
        return cualitativoPositivo; // Caso positivo cuando es baremosNegativo
      } else if (result >= baremosMyIg75) {
        return cualitativoNegativo; // Caso negativo
      }
      return cualitativoIntermedio; // Caso intermedio
    } else {
      if (result <= baremosMnIg25) {
        return cualitativoNegativo; // Caso negativo sin baremosNegativo
      } else if (result >= baremosMyIg75) {
        return cualitativoPositivo; // Caso positivo sin baremosNegativo
      }
      return cualitativoIntermedio; // Caso intermedio sin baremosNegativo
    }
  }
  


  ngOnInit(): void {
    this.sortResults();
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

  //metodo para ordenar los resultados de cada estudiante por orden alfabetico de la escala de resultados
  sortResults(): void {
    const sortedIndices = this.data.resultsTitleScale
      .map((title, index) => ({ title, index }))
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(item => item.index);

    this.data.resultsTitleScale = sortedIndices.map(index => this.data.resultsTitleScale[index]);
    this.data.resultsOverallResult = sortedIndices.map(index => this.data.resultsOverallResult[index]);
    this.data.resultsCodeScale = sortedIndices.map(index => this.data.resultsCodeScale[index]);
    this.data.resultsScale = sortedIndices.map(index => this.data.resultsScale[index]);
    this.data.resultsPhases = sortedIndices.map(index => this.data.resultsPhases[index]);
  }
}
