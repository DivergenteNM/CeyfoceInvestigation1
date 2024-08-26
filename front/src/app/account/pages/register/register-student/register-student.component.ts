import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit {

  institutionReq;
  institutions = [];
  courses = [];
  hide = true;
  fileComplete;
  loading = false;
  routeBase = "";

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(8)
  ]);
  institution = new FormControl('', [
    Validators.required
  ]);
  selectedAge = new FormControl('', [
    Validators.required
  ]);
  selectedSex = new FormControl('', [
    Validators.required
  ]);
  selectedCourse = new FormControl('', [
    Validators.required
  ]);
  selectedSector = new FormControl('', [
    Validators.required
  ]);
  pass1 = new FormControl('', [
    Validators.required
  ]);
  pass2 = new FormControl('', [
    Validators.required
  ]);
  file = new FormControl('', [
    Validators.required,
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  ages = [
    {value: '10', viewValue: '10'},
    {value: '11', viewValue: '11'},
    {value: '12', viewValue: '12'},
    {value: '13', viewValue: '13'},
    {value: '14', viewValue: '14'},
    {value: '15', viewValue: '15'},
    {value: '16', viewValue: '16'},
    {value: '17', viewValue: '17'},
    {value: '18', viewValue: '18'}
  ];
  sex = [
    {value: 'Femenino', viewValue: 'Femenino'},
    {value: 'Masculino', viewValue: 'Masculino'}
  ];
  residences = [
    {value: 'Zona rural', viewValue: 'Zona rural'},
    {value: 'Zona urbana', viewValue: 'Zona urbana'}
  ];

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
    this.routeBase = this.router.url;
  }

  institutionCourses(){
    this.courses = [];
    var institutionWithCode = this.institutionReq.filter(inst=>inst.code===this.institution.value);
    // institutionWithCode[0].courses = institutionWithCode[0].courses.sort(function(a, b){return (parseInt(a.split('-')[0])-parseInt(b.split('-')[0]))});
    institutionWithCode[0].courses = institutionWithCode[0].courses.sort(function(a, b){      
      return parseInt(a.split('-')[0])-parseInt(b.split('-')[0]);
    });
    var aux;
    for (let j = 0; j < institutionWithCode[0].courses.length-1; j++) {
      if (institutionWithCode[0].courses[j].split('-')[0] === institutionWithCode[0].courses[j+1].split('-')[0]) {
        if(institutionWithCode[0].courses[j].split('-')[1]>institutionWithCode[0].courses[j+1].split('-')[1]){
          aux = institutionWithCode[0].courses[j];
          institutionWithCode[0].courses[j] = institutionWithCode[0].courses[j+1];
          institutionWithCode[0].courses[j+1] = aux;
        }
      }
    }
    
    for (let i = 0; i < institutionWithCode[0].courses.length; i++) {
      this.courses.push({
        value: institutionWithCode[0].courses[i],
        viewValue: institutionWithCode[0].courses[i]
      })
    }
  }

  handleImage(event) {
    this.fileComplete = event.target.files[0];
  }

  send(){
    if (this.name.status==='VALID' && this.selectedAge.status==='VALID' && this.selectedSex.status==='VALID'
    && this.selectedCourse.status==='VALID' && this.selectedSector.status==='VALID'
    && this.institution.status==='VALID' && this.emailFormControl.status==='VALID') {
      if (this.file.status==='VALID') {
        // if (this.pass1.value===this.pass2.value && this.pass1.value!=='' && this.pass2.value!=='') {
        //   if(this.validatePassword(this.pass2.value)){
            var formdata = new FormData();
            formdata.append('file',this.fileComplete);
            this.loading = true;
            this.registerService.uploadImage(formdata)
            .subscribe(res=>{
              var file = res.file;
              const json = {
                name: this.name.value,
                age: this.selectedAge.value,
                sex: this.selectedSex.value,
                course: this.selectedCourse.value,
                residenceSector: this.selectedSector.value,
                institution: this.institution.value,
                email: this.emailFormControl.value,
                password: this.pass2.value,
                file: file
              }
              this.registerService.sendData(json)
                .subscribe(res=>{
                  if (res.admissibleness) {
                    this.loading = false;
                    if (res.admissibleness!==undefined) {
                      localStorage.setItem('auth',res.auth);
                      localStorage.setItem('admissibleness',res.admissibleness);
                      localStorage.setItem('name',res.name);
                      // this.router.navigate(['../student/scales']);
                      window.location.href = 'https://ceyfoce.tk/student/scales';
                    }
                    // Swal.fire({
                    //   title: 'Genial !!!',
                    //   text: res.info,
                    //   icon: 'success',
                    //   confirmButtonText: 'Aceptar'
                    // }).then(() => {
                    //   this.router.navigate([`../../student/scales`]);
                    //   // this.router.navigate([`../../account/confirmation/${json.email}`]);
                    //   // document.location.href = `./account/confirmation/${json.email}`;
                    // })
                  }else{
                    this.loading = false;
                    Swal.fire({
                      title: 'Oops',
                      text: res.info,
                      icon: 'info',
                      confirmButtonText: 'Aceptar'
                    })
                  }
                },err=>{
                  this.loading = false;
                  Swal.fire({
                    title: 'Error!',
                    text: 'Intente más tarde',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  })
                })
            },err=>{
              console.log(err);
            })
        //   }
        // }else{
        //   Swal.fire({
        //     title: 'Error!',
        //     text: 'Las contrañas no coinciden',
        //     icon: 'error',
        //     confirmButtonText: 'Aceptar'
        //   })
        // }
      }else{
        Swal.fire({
          title: 'Error!',
          text: 'Seleccione una imagen con el permiso diligenciado',
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
