import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../material/material.module';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  nombre = '';
  email = '';
  edad = undefined;
  sexo = undefined;
  institucion = '';
  curso = undefined;
  sectorResidencia = undefined;
  role = '';
  loading = false;

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    this.http.get<any>(`${environment.baseURL}/users/getDataUser`,{headers})
    .subscribe(res=>{
      this.nombre = res.data.name;
      this.email = res.data.email;
      this.edad = res.data.age;
      this.sexo = res.data.sex;
      this.institucion = res.data.institution;
      this.curso = res.data.course;
      this.sectorResidencia = res.data.residenceSector;
      switch(res.data.role){
        case 'SpAdmin':
          this.role = 'Super Administrador';
          break;

        case 'Admin':
          this.role = 'Investigador';
          break;

        case 'Ally':
          this.role = 'Aliado institucional';
          break;

        case 'student':
          this.role = 'Estudiante';
          break;

        default:
          this.role = 'No definido';
          break;
      }
    })
  }

  async changePassword() {
    try {
      const value = await Swal.fire({
        title: 'Cambiar contraseña',
        html:
          '<input id="swal-input1" class="swal2-input" type="password" placeholder="Contraseña actual" autocomplete="off">' +
          '<input id="swal-input2" class="swal2-input" type="password" placeholder="Contraseña nueva" autocomplete="off">' +
          '<input id="swal-input3" class="swal2-input" type="password" placeholder="Confirmación contraseña" autocomplete="off">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('swal-input1'),
            document.getElementById('swal-input2'),
            document.getElementById('swal-input3'),
          ]
        }
      })
      const oldPass = (<HTMLInputElement>value.value[0]).value;
      const newPass1 = (<HTMLInputElement>value.value[1]).value;
      const newPass2 = (<HTMLInputElement>value.value[2]).value;
      if (oldPass!=='' && newPass1!=='' && newPass2!=='') {
        if(newPass1===newPass2) {
          if(this.validatePassword(newPass1)){
            const auth = localStorage.getItem("auth");
            const headers = new HttpHeaders({"auth":auth});
            const body = {
              oldPassword: oldPass,
              newPassword: newPass1
            }
            this.loading = true;
            
            this.http.post<any>(`${environment.baseURL}/users/updatePass`,body,{headers})
            .subscribe(res=>{
              this.loading = false;
              Swal.fire(
                'Aceptado',
                'Contraseña cambiada',
                'success'
              )
            },err=>{
              this.loading = false;
              try {
                Swal.fire(
                  'Error',
                  err.error.info,
                  'error'
                )
              } catch (error) {
                Swal.fire(
                  'Error',
                  'Intente más tarde',
                  'error'
                )
              }
            })
          }
        }else{
          Swal.fire(
            'Contraseñas incorrectas',
            'La nueva contraseña no coincide',
            'warning'
          )
        }
      }else{
        Swal.fire(
          'Datos incorrectos',
          'Llene todos los datos',
          'warning'
        )
      }
    } catch (error) {
      
    }
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
