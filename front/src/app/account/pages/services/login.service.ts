import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  postUser(body:any){
    // return this.http.post(`${environment.baseURL}/account`);
    return this.http.post<any>(`${environment.baseURL}/account/login`,body)
  }

  confirmation(body:any) {
    return this.http.post<any>(`${environment.baseURL}/account/confirmation`,body)
  }

  resend(email) {
    return this.http.post<any>(`${environment.baseURL}/account/resend`,email)
  }

  recoveryOne(email) {
    return this.http.post<any>(`${environment.baseURL}/account/recovery/send`,email)
  }

  recoveryTwo(data) {
    return this.http.post<any>(`${environment.baseURL}/account/recovery`,data)
  }
}
