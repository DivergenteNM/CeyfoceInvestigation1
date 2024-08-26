import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http:HttpClient) { }

  getInstitutions(){
    return this.http.get<any>(`${environment.baseURL}/institutions/userRegister`)
  }

  sendData(data){
    return this.http.post<any>(`${environment.baseURL}/account/register/student`,data);
  }

  sendDataAdmin(data){
    return this.http.post<any>(`${environment.baseURL}/account/register/other`,data);
  }

  uploadImage(file: any){
    return this.http.post<any>(`${environment.baseURL}/account/uploadImage`,file);
  }
}
