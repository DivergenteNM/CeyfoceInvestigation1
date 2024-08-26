import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {
  email:string = '';
  codeConfirmation: string = '';
  password1: string = '';
  password2: string = '';
  stageOne: boolean = true;
  stageTwo: boolean = false;
  loading: boolean = false;
  attempts: number = 0;
  hide = true;
  constructor(private loginService:LoginService,private route:Router) { }

  ngOnInit(): void {
  }

  sendEmail() {
    var cont = 0;
    for (let i = 0; i < this.email.length; i++) {
      if (this.email[i]==='@' || this.email[i]==='.') {
        cont++;
      }
    }
    if (this.email.length>6 && cont>=2) {
      this.loading = true;
      this.loginService.recoveryOne({email:this.email})
      .subscribe(res=>{
        this.stageOne = false;
        this.stageTwo = true;
        this.loading = false;
      },err=>{
        this.loading = false;
        try {
          if (err.error.message==='Usuario no existe') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Email no registrado'
            })
          }else if (err.error.message==='Error') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Por favor intente más tarde'
            })
          }
        } catch (error) {
          
        }
      })
      
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Verifique su email'
      })
    }
  }

  sendChange() {
    if (this.attempts <= 2) {
      if (this.codeConfirmation.length>5) {
        if (this.password1===this.password2 && this.password1!=='' && this.password2!=='') {
          if(this.validatePassword(this.password2)){
              const json = {
                email: this.email,
                codeRecovery : this.codeConfirmation,
                newPassword : this.password2
              }
              this.loading = true;
              this.loginService.recoveryTwo(json)
              .subscribe(res=>{
                this.loading = false;
                Swal.fire({
                  icon: 'success',
                  title: 'Genial',
                  text: 'Contraseña restaurada'
                }).then(()=>{
                  this.route.navigateByUrl('account')
                })
              },err=>{
                this.loading = false;
                try {
                  Swal.fire({
                    icon: 'info',
                    text: err.error.message
                  })
                } catch (error) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Intenta más tarde'
                  })
                }
              })
          }
        }else{
          Swal.fire({
            icon: 'info',
            title: 'Las contraseñas no coinciden',
            text: 'Verifique las contraseñas'
          })
        }
      }else{
        Swal.fire({
          icon: 'info',
          title: 'Código de confirmación inválido',
          text: 'Verifique su correo y vuelva a escribir el código'
        })
      }
    }else{
      Swal.fire({
        icon: 'error',
        title: `Intento ${this.attempts}`,
        text: 'Límite de intentos alcanzados'
      }).then(()=>{
        this.route.navigateByUrl('/account');
      })
    }
    this.attempts++;
  }

  validatePassword(pass) {
    var flag = false;
    var contMay = 0;
    var contMin = 0;
    var contNum = 0;
    var contSim = 0;
    for (let i = 0; i < pass.length; i++) {
      if (pass.charCodeAt(i)>=65 && pass.charCodeAt(i)<=90) {
        contMay++;
      }
      if (pass.charCodeAt(i)>=97 && pass.charCodeAt(i)<=122) {
        contMin++;
      }
      if (pass.charCodeAt(i)>=48 && pass.charCodeAt(i)<=57) {
        contNum++;
      }
      if ((pass.charCodeAt(i)>=33 && pass.charCodeAt(i)<=38) ||
          pass.charCodeAt(i)===43 || pass.charCodeAt(i)===47 || pass.charCodeAt(i)===64 ||
          pass.charCodeAt(i)===63) {
        contSim++;
      }
    }
    if (contMay>0 && contMin>0 && contNum>0 && contSim>0) {
      flag = true;
    }else{
      Swal.fire({
        title: 'Contraseña incorrecta',
        text: 'Incluya números, letras mayúsculas, minúsculas y símbolos !,",#,$,%,&,+,/,@,?',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
    }
    return flag;
  }
}
