import { Component, Input, OnInit } from '@angular/core';
import { PlatformService } from 'src/app/platform/services/platform.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  @Input() idReq;

  users = [];
  usersSend = [];
  style = '';

  messageActivate: boolean = false;
  messageTitle: string = '';
  messageInfo: string = '';
  loading:boolean = false;
  institutions = [];
  url = '';
  imageActive = false;

  constructor(private platformService:PlatformService) { }

  ngOnInit(): void {
    var idReqSend = "2";
    this.loading = true;
    if (this.idReq!==undefined) {
      idReqSend = "1";
    }
    if(localStorage.getItem("admissibleness")==="6465asd7#asd-1"){
      this.platformService.getUsersAdmin(idReqSend)
        .subscribe(res=>{
          this.users = res.users;
          this.loading = false;
          this.platformService.getInstitutionsUpdate()
            .subscribe(inst=>{
              this.institutions = inst.institutions;
            })
        },err=>{
          this.loading = false;
          
        })
        this.style = 'admin';
    }else if(localStorage.getItem("admissibleness")==="1201fpj4/tmq-1"){
      this.platformService.getUsersAlly(idReqSend)
        .subscribe(res=>{
          this.users = res.users;
          this.loading = false;
        },err=>{
          this.loading = false;
        })
      this.style = 'ally';
    }
  }

  showImage(user) {
    this.imageActive = true;
    this.url = user.file;
  }

  changeSelect(index) {
    var flag = true;
    for (let j = 0; j < this.usersSend.length; j++) {
      if (this.usersSend[j]._id===this.users[index]._id) {
        this.usersSend[j] = this.users[index];
        flag = false;
        break;
      }
    }
    
    if (flag) {
      this.usersSend.push(this.users[index])
    }
  }

  sendData() {
    if (this.usersSend.length>0) {
      var arrayAux = [];
      for (let i = 0; i < this.usersSend.length; i++) {
        var inst = "";
        if(this.getCodeInstitution(this.usersSend[i].institution)===undefined){
          inst = this.usersSend[i].institution[0];
        }else{
          inst = this.usersSend[i].institution;
        }
        arrayAux.push({
          "id": this.usersSend[i]._id,
          "institution": this.getCodeInstitution(inst),
          "role": this.usersSend[i].role
        });
      }
      this.messageActivate = true;
      this.messageTitle = "Enviando información";      
      this.platformService.sendUpdateUsersRol(arrayAux)
        .subscribe(res=>{
          this.messageInfo = res.info;
        })
    }else{
      this.messageActivate = true;
      this.messageTitle = "Información";
      this.messageInfo = "No se modificó ningún registro";
    }
  }

  closeAlert() {
    this.messageActivate = false;
    this.messageInfo = '';
    window.location.reload();
  }

  getCodeInstitution(nameInstitution) {
    for (let i = 0; i < this.institutions.length; i++) {
      if(this.institutions[i].name===nameInstitution){
        return this.institutions[i].code;
      }
    }
  }

  close() {
    this.url = '';
    this.imageActive = false;
  }
}
