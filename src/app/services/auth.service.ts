import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {jwtDecode} from "jwt-decode";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated:boolean = false;
  roles:any;
  username:any;
  accessToken!:any;
  constructor(private http:HttpClient,private route:Router) { }
  public laodProfile(data :any) {
    this.accessToken = data['access-token'];
    this.isAuthenticated = true;
    let decodedJwt:any =jwtDecode(this.accessToken);
    this.username = decodedJwt.sub;
    this.roles = decodedJwt.scope;
    window.localStorage.setItem("jwt-token",this.accessToken);
  }

  loadJwtTokenFromLocalStorage() {
    let token = window.localStorage.getItem("jwt-token");
    if (token) {
      this.laodProfile({"access-token":token})
      this.route.navigateByUrl("/admin/customers");
    }
  }
  // login function
  public login(username:string , password:string ){
    // set headers
    let options  ={
      headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
    }
    // set params
    let params = new HttpParams().set('username',username).set('password',password);
    // send request
    return this.http.post( environment.backend_host+"/auth/login",params,options);
  }

   logout() {
    this.isAuthenticated = false;
    this.roles = null;
    this.username = null;
    this.accessToken = null;
    window.localStorage.removeItem("jwt-token");
     this.route.navigateByUrl("/login")
  }
}
