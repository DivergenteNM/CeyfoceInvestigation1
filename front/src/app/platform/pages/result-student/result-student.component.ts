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


  getStyle(m: number): any {
    const scaleIndex = this.getIndex(this.data.resultsCodeScale[m]);
    const scale = this.scales[scaleIndex];

    if (!scale) {
      return { 'background-color': '#ff8d00bf' }; // Estilo por defecto
    }

    const baremosNegativo = scale.baremosNegativo;
    // const cualitativoNegativo = scale.cualitativoNegativo;
    // const cualitativoIntermedio = scale.cualitativoIntermedio;
    // const cualitativoPositivo = scale.cualitativoPositivo;

    const result = this.convertString(this.data.resultsOverallResult[m]);
    const baremosMnIg25 = this.convertString(scale.baremosMnIg25);
    const baremosMyIg75 = this.convertString(scale.baremosMyIg75);
    //console.log("Objeto scale:", scale);

    // console.log("cualitativo: ", cualitativoNegativo);
    // console.log("cualitativo: ", cualitativoIntermedio);
    // console.log("cualitativo: ", cualitativoPositivo);

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
