import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate, CanLoad {
  constructor(private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(!localStorage.getItem("auth")){
      localStorage.setItem("admissibleness","");
      localStorage.setItem("name","");
      return false;
    }
    if(localStorage.getItem("admissibleness")==='sl34mdms#fgd-6'){
      return true;
    }else{
      this.router.navigateByUrl('/');
    }
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if(!localStorage.getItem("auth")){
      localStorage.setItem("admissibleness","");
      localStorage.setItem("name","");
      this.router.navigate(['./account'])
      return false;
    }
    return true;
  }
}
