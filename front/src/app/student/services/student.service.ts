import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getScalesStudentAllowed() {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/student/scales`,{headers});
  }

  getScaleStudentAnswer(idScale) {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/student/scale/${idScale}`,{headers});
  }

  sendResults(results) {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.post<any>(`${environment.baseURL}/results/students`,results,{headers});
  }
  
}
