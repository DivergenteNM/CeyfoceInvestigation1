import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:string = '';
  password:string = '';

  emailError:string = 'notification-none';
  // emailError:string = 'notification';
  passwordError:string = 'notification-none';
  // passwordError:string = 'notification';
  typePassword:string = 'password';
  loading:boolean = false;
  error:string = '';
  
  constructor(private loginService:LoginService, private router:Router) { }

  ngOnInit(): void {
  }

  onButtonClick(): void {
    // Lógica para manejar el clic del botón
    document.location.href = './home';
  }

  sendData() {
    this.loading = true;
    this.error = '';
    const newUser = {'email':this.email,'password':this.password};
    this.loginService.postUser(newUser)
      .subscribe((res:any) => {
        this.loading = false;        
        if (res.admissibleness!==undefined) {
          localStorage.setItem('auth',res.auth);
          localStorage.setItem('admissibleness',res.admissibleness);
          localStorage.setItem('name',res.name);
          this.router.navigate(['/platform/scales']);
        }else{
          this.error = `Usuario en espera de autorización`;
        }
      },err=>{
        this.error = err.error.message;
        if (err.error.message==='Email no verificado') {
          this.error = err.error.message;
          this.router.navigateByUrl(`/account/confirmation/${this.email}`);
        }
        this.loading = false;
      })
  }

  changeTypePassword() {
    if(this.typePassword==='password'){
      this.typePassword = 'text';
    }else{
      this.typePassword = 'password';
    }
  }
}
