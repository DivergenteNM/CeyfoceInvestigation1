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
  answerForm:string = '';
  titlePhase:string = '';
  factors:string[] = [];
  questions:any = [];
  baremosMnIg25 = 0;
  baremosMyIg75 = 0;

  messageActivate: boolean = false;
  messageTitle: string = '';
  messageInfo: string = '';
  messageButton: boolean = false;

  @Input() scale:any;

  constructor(private platformServices:PlatformService, private router: Router) { }

  ngOnInit(): void {
    if(this.scale===undefined){
      const scaleTemp = localStorage.getItem("scaleTemp");
      if(scaleTemp){
        const jsonSave = JSON.parse(scaleTemp);
        this.title = jsonSave.title;
        this.description = jsonSave.description;
        this.answerForm = jsonSave.answerForm;
        this.factors = jsonSave.factors;
        this.questions = jsonSave.questions;
        this.baremosMnIg25 = jsonSave.baremosMnIg25;
        this.baremosMyIg75 = jsonSave.baremosMyIg75;
        localStorage.removeItem("scaleTemp");
      }
    }else {
      this.code = this.scale.codeScale;
      this.title = this.scale.title;
      this.description = this.scale.description;
      this.answerForm = this.scale.answerForm;
      this.factors = this.scale.factors;
      this.questions = this.scale.questions;
      this.baremosMnIg25 = this.scale.baremosMnIg25;
      this.baremosMyIg75 = this.scale.baremosMyIg75;
    }
  }

  addFase() {
    if(this.titlePhase.trim()!==''){
      this.factors.push(this.titlePhase);
      this.titlePhase = '';
    }
  }

  addQuestion() {
    this.questions.push({
      'textQuestion': '',
      'typeOfQuestion': '',
      'factor': ''
    })
  }

  responseQuestionComponent(e){
    const i = parseInt(e.index);
    this.questions[i] = e.question;
  }

  clearAll() {
    this.title = '';
    this.description = '';
    this.answerForm = '';
    this.factors = [];
    this.questions = [];
    this.baremosMnIg25 = 0;
    this.baremosMyIg75 = 0;
  }

  sendScale() {
    if(this.validate()){
      const sendJson = {
        'title': this.title,
        'description': this.description,
        'answerForm': this.answerForm,
        'factors': this.factors,
        'questions': this.questions,
        'baremosMnIg25': this.baremosMnIg25,
        'baremosMyIg75': this.baremosMyIg75
      }
      this.messageActivate = true;
      this.messageTitle = 'Enviando información';
      this.messageInfo = `Espere un momento ...`;      
      this.platformServices.sendScale(sendJson,this.code)
        .subscribe(res => {
          this.messageActivate = true;
          this.messageButton = true;
          this.messageTitle = res.info;
          this.messageInfo = ``;
        },err=>{
          if (err.status===500) {
            var errorMessage = '';
            try {
              errorMessage = err.error.error.message;
            } catch (error) {
              errorMessage = '';
            }
            
            if(errorMessage==="invalid token"){
              localStorage.setItem('scaleTemp',`${JSON.stringify(sendJson)}`);
              localStorage.removeItem("auth");
              localStorage.removeItem("admissibleness");
              localStorage.removeItem("name");
              this.messageActivate = true;
              this.messageTitle = 'Usuario incorrecto !!!';
              this.messageInfo = `Vuelva a iniciar sesión`;
              setInterval(()=>{
                this.router.navigate(['./account']);
              },4000);
            }else{
              localStorage.setItem('scaleTemp',`${JSON.stringify(sendJson)}`);
              this.messageActivate = true;
              this.messageTitle = 'Error del servidor';
              this.messageInfo = err.error;
              setInterval(()=>{
                this.router.navigate(['/']);
              },5000);
            }
          }else{
            localStorage.removeItem("auth");
            localStorage.removeItem("admissibleness");
            localStorage.removeItem("name");
            this.messageActivate = true;
            this.messageTitle = 'Usuario no autorizado !!!';
            this.messageInfo = `Vuelva a iniciar sesión`;
            setInterval(()=>{
              this.router.navigate(['./account']);
            },4000);
          }
        })    
    }else{
      this.messageActivate = true;
      this.messageTitle = 'Espacios sin llenar';
      this.messageInfo = `Verifique que todos los espacios estén llenos`;
      setInterval(()=>{
        this.messageActivate = false;
        this.messageButton = false;
      },5000);
    }
  }

  validate(){
    if (this.title !== '' && this.description !== '' && this.answerForm !== '' && this.questions.length > 0) {
      return true;
    }
    return false;
  }

  closeAlert() {
    this.messageActivate = false;
    this.messageButton = false;
    this.clearAll();
    // this.router.navigate(['./platform/scales']);
    window.location.reload();
    
  }

  removePhase(i) {
    this.factors.splice(i,1);
  }
}
