import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  public isLoggedIn: boolean = false; // Variable para controlar el estado de autenticación


  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  affairFormControl = new FormControl('', [Validators.required]);
  messageFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  name: string = "Iniciar sesión";
  loading: boolean = false;
  menuActive: boolean = false; // Estado del menú en versión móvil


  itemsMenu = [
    {
      title: 'Registro',
      link: '/account/register',
      subMenu: []
    }
  ]




  constructor(
    config: NgbCarouselConfig,
    private http: HttpClient,
    public dialog: MatDialog) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit(): void {
    //---------------------------
    this.checkLoginStatus();
    //---------------------------
    try {
      var nameVar = localStorage.getItem("name").split(" ")[0];
    } catch (error) {

    }
    if (nameVar) {
      this.name = "¡Hola " + nameVar + "!";
    }
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive; // Alterna el estado del menú
  }

  checkLoginStatus(): void {
    // Lógica para verificar si el usuario está logueado
    // Esto puede ser una llamada a un servicio de autenticación
    // Por ejemplo:
    this.isLoggedIn = !!localStorage.getItem("name"); // Ejemplo simple usando localStorage
  }

  public redirect() {
    document.location.href = './account/login';
  }

  public sendMessage() {
    if (this.emailFormControl.valid && this.affairFormControl.valid && this.messageFormControl.valid) {
      this.loading = true;
      const json = {
        email: this.emailFormControl.value,
        affair: this.affairFormControl.value,
        message: this.messageFormControl.value
      }
      this.http.post<any>(`${environment.baseURL}/platform/internalMessage`, json)
        .subscribe(res => {
          Swal.fire(
            'Genial',
            'Mensaje enviado !!!',
            'success'
          )
          this.emailFormControl.reset('');
          this.affairFormControl.reset('');
          this.messageFormControl.reset('');
          this.loading = false;
        })
    } else {
      Swal.fire(
        'Error',
        'Verifique su información e intente nuevamente',
        'error'
      )
    }
  }

}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './dialogOne.html',
})
export class DialogContent {
  constructor(
    public dialogRef: MatDialogRef<DialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}