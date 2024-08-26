import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  count: number = 0;
  email: string;
  codeConfirmation: string;
  loading: boolean = false;
  constructor(private loginService:LoginService, private route:Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.email = this.route.routerState.snapshot.url.split('/')[3];
  }

  send(){
    if (this.count<=3) {
      if (this.codeConfirmation && this.codeConfirmation.length>=4 && this.codeConfirmation.length<=10) {
        this.loading = true;
        const json = {
          email: this.email,
          codeConfirmation: this.codeConfirmation
        }
        this.loginService.confirmation(json)
        .subscribe(res=>{
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Felicitaciones !!!',
            text: 'Tu correo ha sido confirmado',
          }).then(() => {
            this.route.navigateByUrl('/account/login');
          })
        },err=>{
          this.loading = false;
          try {
            if (err.error.message==='Código incorrecto') {
              Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'Por favor, verifica tu código',
              })
              this.codeConfirmation = '';
            }else if(err.error.message==='Error'){
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Tuvimos un error, intenta más tarde',
              })
            }else if(err.error.message==='Usuario no existe'){
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario no está registrado, por favor verifica',
              }).then(() => {
                this.route.navigateByUrl('/account/login');
              })
            }else if(err.error.message==='Email ya confirmado'){
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El email ya fue confirmado',
              }).then(() => {
                this.route.navigateByUrl('/account/login');
              })
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Tuvimos un error, intenta más tarde',
            })
          }
        })
      }else{
        Swal.fire('El código de confirmación debe tener entre 4 y 10 caracteres')
      }
      this.count++;
    }else{
      this.route.navigateByUrl('/account/login');
    }
  }

  resend() {
    this.loginService.resend({email:this.email})
    .subscribe(res=>{
      this.loading = false;
      Swal.fire({
        icon: 'success',
        title: 'Genial',
        text: 'El nuevo código fue enviado',
      })
    },err=>{
      try {
        if(err.error.message==='Error'){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Tuvimos un error, intenta más tarde',
          })
        }else if(err.error.message==='Usuario no existe'){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El usuario no está registrado, por favor verifica',
          }).then(() => {
            this.route.navigateByUrl('/account/login');
          })
        }else if(err.error.message==='Email ya confirmado'){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El email ya fue confirmado',
          }).then(() => {
            this.route.navigateByUrl('/account/login');
          })
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Tuvimos un error, intenta más tarde',
        })
      }
    })
  }
}
