import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-scales-create',
  templateUrl: './scales-create.component.html',
  styleUrls: ['./scales-create.component.css']
})
export class ScalesCreateComponent implements OnInit {

  code: string = '1';
  title: string = '';
  description: string = '';
  answerForm: string = '';
  titlePhase: string = '';
  factors: string[] = [];
  questions: any = [];
  baremosMnIg25;
  baremosMyIg75;
  cualitativoNegativo;
  cualitativoIntermedio;
  cualitativoPositivo;
  // Variable para el checkbox de baremos negativo
  baremosNegativo: boolean;


  editingIndex: number | null = null;
  isEditing: boolean = false;

  isBaremosNegativo() {
    // Lógica para enviar el valor a otro componente o vista
    console.log("¿Baremos es negativo?", this.baremosNegativo);
    //si está activado el checkbox, significa true
  }

  savePhase() {
    const trimmedPhase = this.titlePhase.trim();
    if (trimmedPhase !== '') {
      // Verificar si el factor ya existe en la lista
      const factorExists = this.factors.some(factor => factor.toLowerCase() === trimmedPhase.toLowerCase());
      if (!factorExists) {
        if (this.editingIndex !== null) {
          this.factors[this.editingIndex] = trimmedPhase;
          this.editingIndex = null;
        } else {
          this.factors.push(trimmedPhase);
        }
        this.titlePhase = '';
      } else {
        this.messageActivate = true;
        this.messageTitle = 'Factor duplicado';
        this.messageInfo = 'Este factor ya ha sido agregado.';
        setTimeout(() => {
          this.messageActivate = false;
        }, 2500);
      }
    }
  }

  editPhase(index: number) {
    this.titlePhase = this.factors[index];
    this.editingIndex = index;
    this.isEditing = true;
  }

  removePhase(index: number) {
    this.factors.splice(index, 1);
    if (this.isEditing && this.editingIndex === index) {
      this.clearPhaseEditor();
    }
  }

  clearPhaseEditor() {
    this.titlePhase = '';
    this.isEditing = false;
    this.editingIndex = null;
  }

  messageActivate: boolean = false;
  messageTitle: string = '';
  messageInfo: string = '';
  messageButton: boolean = false;

  @Input() scale: any;

  constructor(private platformServices: PlatformService, private router: Router) { }

  ngOnInit(): void {
    if (this.scale === undefined) {
      const scaleTemp = localStorage.getItem("scaleTemp");
      if (scaleTemp) {
        const jsonSave = JSON.parse(scaleTemp);
        this.title = jsonSave.title;
        this.description = jsonSave.description;
        this.answerForm = jsonSave.answerForm;
        this.factors = jsonSave.factors;
        this.questions = jsonSave.questions;
        this.baremosMnIg25 = jsonSave.baremosMnIg25;
        this.baremosMyIg75 = jsonSave.baremosMyIg75;
        this.baremosNegativo = jsonSave.baremosNegativo;
        this.cualitativoNegativo = jsonSave.cualitativoNegativo;
        this.cualitativoIntermedio = jsonSave.cualitativoIntermedio;
        this.cualitativoPositivo = jsonSave.cualitativoPositivo;
        localStorage.removeItem("scaleTemp");
      }
    } else {
      this.code = this.scale.codeScale;
      this.title = this.scale.title;
      this.description = this.scale.description;
      this.answerForm = this.scale.answerForm;
      this.factors = this.scale.factors;
      this.questions = this.scale.questions;
      this.baremosMnIg25 = this.scale.baremosMnIg25;
      this.baremosMyIg75 = this.scale.baremosMyIg75;
      this.baremosNegativo = this.scale.baremosNegativo;
      this.cualitativoNegativo = this.cualitativoNegativo;
      this.cualitativoIntermedio = this.cualitativoIntermedio;
      this.cualitativoPositivo = this.cualitativoPositivo;
    }
  }

  addFase() {
    if (this.titlePhase.trim() !== '') {
      this.factors.push(this.titlePhase);
      this.titlePhase = '';
    }
  }

  addQuestion() {
    this.questions.push({
      'textQuestion': '',
      'typeOfQuestion': '',
      'factor': ''
    });
  }

  responseQuestionComponent(e) {
    const i = parseInt(e.index);
    this.questions[i] = e.question;
  }

  clearAll() {
    this.title = '';
    this.description = '';
    this.answerForm = '';
    this.factors = [];
    this.questions = [];
    this.baremosMnIg25 = undefined;
    this.baremosMyIg75 = undefined;
    this.baremosNegativo = false;
    this.cualitativoNegativo = undefined;
    this.cualitativoIntermedio = undefined;
    this.cualitativoPositivo = undefined;
  }

  sendScale() {
    if (this.validate()) {
      const sendJson = {
        'title': this.title,
        'description': this.description,
        'answerForm': this.answerForm,
        'factors': this.factors,
        'questions': this.questions,
        'baremosMnIg25': this.baremosMnIg25,
        'baremosMyIg75': this.baremosMyIg75,
        'baremosNegativo': this.baremosNegativo,  // Enviar valor del checkbox
        'cualitativoNegativo': this.cualitativoNegativo,
        'cualitativoIntermedio': this.cualitativoIntermedio,
        'cualitativoPositivo': this.cualitativoPositivo,
      };
      this.messageActivate = true;
      this.messageTitle = 'Enviando información';
      this.messageInfo = `Espere un momento ...`;
      this.platformServices.sendScale(sendJson, this.code)
        .subscribe(res => {
          this.messageActivate = true;
          this.messageButton = true;
          this.messageTitle = res.info;
          this.messageInfo = ``;
        }, err => {
          // Manejo de errores
        });
    } else {
      this.messageActivate = true;
      this.messageTitle = 'Espacios sin llenar';
      this.messageInfo = `Verifique que todos los espacios estén llenos`;
      setTimeout(() => {
        this.messageActivate = false;
      }, 5000);
    }
  }

  validate() {
    if (
      this.title.trim() !== '' &&
      this.description.trim() !== '' &&
      this.answerForm !== '' &&
      this.factors.length > 0 &&
      this.questions.length > 0 &&
      this.baremosMnIg25 !== '' &&
      this.baremosMyIg75 !== '' &&
      this.cualitativoNegativo !== '' &&
      this.cualitativoIntermedio !== '' &&
      this.cualitativoPositivo !== ''
    ) {
      return true;
    } else {
      this.messageActivate = true;
      this.messageTitle = 'Espacios sin llenar';
      this.messageInfo = 'Por favor, complete todos los campos requeridos.';
      setTimeout(() => {
        this.messageActivate = false;
      }, 3000);
      return false;
    }
  }

  closeAlert() {
    this.messageActivate = false;
    this.messageButton = false;
    this.clearAll();
    window.location.reload();
  }
}
