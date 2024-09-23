import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private http: HttpClient) { }

  sendScale(scale:any,code:string) {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.post<any>(`${environment.baseURL}/platform/createScale/${code}`,scale,{headers});
  }
  
  getScalesEdit() {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/platform/scales`,{headers});
  }

  getScale(code:string) {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/platform/scale/${code}`,{headers});
  }

  deleteScale(scaleCode: string): Observable<any> {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({ "auth": auth });
    return this.http.delete<any>(`${environment.baseURL}/scale/${scaleCode}`, { headers });
  }

  // deleteScale(code: string) {
  //   const auth = localStorage.getItem("auth");
  //   const headers = new HttpHeaders({"auth": auth});
  //   return this.http.delete<any>(`${environment.baseURL}/platform/scale/${code}`, { headers });
  // }

  getResults(data:any){
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.post<any>(`${environment.baseURL}/results/filter`,data,{headers});
  }

  getFilterData(){
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/users/filter`,{headers});
  }

  getScalesResults() {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/results/scales`,{headers});
  }

  createInstitution(code,data) {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.post<any>(`${environment.baseURL}/institutions/add/${code}`,data,{headers});
  }

  getInstitutionsUpdate() {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/institutions/getAll`,{headers});
  }

  getInstitution(code:string) {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/institutions/unique/${code}`,{headers});
  }

  getUsersAdmin(id) {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/platform/admin/toAuthorize/${id}`,{headers});
  }

  getUsersAlly(id) {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/platform/ally/toAuthorize/${id}`,{headers});
  }

  sendUpdateUsersRol(users) {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.post<any>(`${environment.baseURL}/platform/updateRole`,users,{headers});
  }

  getNameStudents() {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.get<any>(`${environment.baseURL}/platform/namesStudents`,{headers});
  }

  getDataStudent(nameStudent) {
    const auth = localStorage.getItem("auth");
    const headers = new HttpHeaders({"auth":auth});
    return this.http.post<any>(`${environment.baseURL}/platform/dataStudent`,nameStudent,{headers});
  }

  sendMessage(infoMessage) {
    return this.http.post<any>(`${environment.baseURL}/platform/internalMessage`,infoMessage);
  }
}
