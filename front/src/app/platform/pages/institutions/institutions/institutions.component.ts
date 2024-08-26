import { Component, Input, OnInit } from '@angular/core';
import { PlatformService } from 'src/app/platform/services/platform.service';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.css']
})
export class InstitutionsComponent implements OnInit {

  code:string = '1';
  name:string = '';
  institution:boolean = false;
  courses:string[] = [];
  newCourse:string = '';
  typeOfInstitution:string = '';
  permissions:string[] = [];

  scales = [];

  messageActivate: boolean = false;
  messageTitle: string = '';
  messageInfo: string = '';
  messageButton: boolean = false;

  @Input() institutionSend:any;

  constructor(private platformService:PlatformService) { }

  ngOnInit(): void {
    if (this.institutionSend!==undefined) {
      this.institution = true;
      this.code = this.institutionSend.code;
      this.name = this.institutionSend.name;
      this.courses = this.institutionSend.courses;
      this.typeOfInstitution = this.institutionSend.type;
      this.permissions = this.institutionSend.permissions;
      this.platformService.getScalesEdit()
        .subscribe(res=>{
          var flag = false;
          for (let k = 0; k < res.scales.length; k++) {
            flag = false;
            for (let m = 0; m < this.permissions.length; m++) {
              if (res.scales[k].codeScale===this.permissions[m]) {
                   flag = true;            
              }
            }
            this.scales.push({
              checked: flag,
              scale: res.scales[k]
            }) 
          }
        })
    }else{
      this.platformService.getScalesEdit()
        .subscribe(res=>{
          for (let j = 0; j < res.scales.length; j++) {
            this.scales.push({
              checked: false,
              scale: res.scales[j]
            }) 
          }
        })
    }
  }

  sendInstitution() {
    if (this.name.length>2 && this.typeOfInstitution!=='') {
      var permissionsSend = [];
      for (let i = 0; i < this.scales.length; i++) {
        if (this.scales[i].checked===true) {
          permissionsSend.push(this.scales[i].scale.codeScale)
        }
      }
      const data = {
        name: this.name,
        courses: this.courses,
        type: this.typeOfInstitution,
        permissions: permissionsSend
      };
      this.messageActivate = true;
      this.messageTitle = 'Enviando información';
      this.messageInfo = `Espere un momento ...`;
      this.platformService.createInstitution(this.code,data)
        .subscribe(res=>{
          console.log(res);
          this.messageActivate = true;
          this.messageButton = true;
          this.messageTitle = res.info;
          this.messageInfo = ``;
        },err=> {
          var messageShow = '';
          try {
            messageShow = err.error.error.message;
          } catch (error) {
            messageShow = 'Comuníquese con el administrador';
          }
          if (err.status===500) {            
            this.messageActivate = true;
            this.messageTitle = 'Problema al enviar los datos';
            this.messageInfo = 'Mensaje: '+messageShow;
            setInterval(()=>{
              this.messageActivate = false;
              this.messageButton = false;
            },5000);
          }
        })
    }else{
      this.messageActivate = true;
      this.messageTitle = 'Espacios sin llenar';
      this.messageInfo = `El nombre y tipo son obligatorios`;
      setInterval(()=>{
        this.messageActivate = false;
        this.messageButton = false;
      },5000);
    }
  }

  addCourse() {
    const cleaningCourse = this.newCourse.trim();
    var correct = true;
    var count = 0;
    for (let i = 0; i < cleaningCourse.length; i++) {
      if (cleaningCourse[i]==='-') {
        count++;
        if (count>=2) {
          correct = false;
        }
      }
    }
    if (correct && count===1) {
      this.courses.push(this.newCourse);
    }
    this.newCourse = '';
  }

  removeCourse(i) {
    this.courses.splice(i,1);
  }

  changeChecked(i) {
    this.scales[i].checked = !this.scales[i].checked;
  }

  clearAll() {
    this.name = '';
    this.code = '1';
    this.institution = false;
    this.courses = [];
    this.newCourse = '';
    this.typeOfInstitution = '';
    this.permissions = [];
  }

  closeAlert() {
    this.messageActivate = false;
    this.messageButton = false;
    this.clearAll();
    window.location.reload();
  }
}
