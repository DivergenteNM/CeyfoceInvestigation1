import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css']
})
export class RegisterAdminComponent implements OnInit {

  institutionReq;
  institutions = [];
  courses = [];
  hide = true;
  fileComplete;

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(8)
  ]);
  institution = new FormControl('', [
    Validators.required
  ]);
  pass1 = new FormControl('', [
    Validators.required
  ]);
  pass2 = new FormControl('', [
    Validators.required
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  constructor(
    private registerService:RegisterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerService.getInstitutions()
    .subscribe(res=>{
      this.institutionReq = res.institutions;
      for (let i = 0; i < res.institutions.length; i++) {
        this.institutions.push({
          value: res.institutions[i].code,
          viewValue: res.institutions[i].name
        })
      }
    })
  }

  send(){
    if (this.name.status==='VALID' && this.institution.status==='VALID' && this.emailFormControl.status==='VALID') {
        if (this.pass1.value===this.pass2.value && this.pass1.value!=='' && this.pass2.value!=='') {
          if(this.validatePassword(this.pass2.value)){
            const json = {
              name: this.name.value,
              email: this.emailFormControl.value,
              password: this.pass2.value,
              institution: this.institution.value
            }
            this.registerService.sendDataAdmin(json)
              .subscribe(res=>{
                if (res.info==='Usuario creado') {
                  Swal.fire({
                    title: 'Genial !!!',
                    text: res.info,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                  }).then(() => {
                    this.router.navigate([`../../account/confirmation/${json.email}`]);
                    // document.location.href = `./account/confirmation/${json.email}`;
                  })
                }else{
                  Swal.fire({
                    title: 'Oops',
                    text: res.info,
                    icon: 'info',
                    confirmButtonText: 'Aceptar'
                  })
                }
              },err=>{
                Swal.fire({
                  title: 'Error!',
                  text: 'Intente más tarde',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
                })
              })
          }
        }else{
          Swal.fire({
            title: 'Error!',
            text: 'Las contrañas no coinciden',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        }
    }else{
      Swal.fire({
        title: 'Error!',
        text: 'Verifique que haya seleccionado y llenado todos los espacios',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
    }
  }

  validatePassword(pass) {
    var flag = false;
    // var contMay = 0;
    // var contMin = 0;
    // var contNum = 0;
    // var contSim = 0;
    // for (let i = 0; i < pass.length; i++) {
    //   if (pass.charCodeAt(i)>=65 && pass.charCodeAt(i)<=90) {
    //     contMay++;
    //   }
    //   if (pass.charCodeAt(i)>=97 && pass.charCodeAt(i)<=122) {
    //     contMin++;
    //   }
    //   if (pass.charCodeAt(i)>=48 && pass.charCodeAt(i)<=57) {
    //     contNum++;
    //   }
    //   if ((pass.charCodeAt(i)>=33 && pass.charCodeAt(i)<=38) ||
    //       pass.charCodeAt(i)===43 || pass.charCodeAt(i)===47 || pass.charCodeAt(i)===64 ||
    //       pass.charCodeAt(i)===63) {
    //     contSim++;
    //   }
    // }
    if (pass.length>2) {
      flag = true;
    }else{
      Swal.fire({
        title: 'Contraseña incorrecta',
        text: 'El campo de contraseña está vacío',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
    }
    return flag;
  }
}
