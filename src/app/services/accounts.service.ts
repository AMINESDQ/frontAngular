import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AccountDetails} from "../models/account";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  constructor(private http :HttpClient) { }
  public getAccounts(accountId :String,page:number, size:number):Observable<AccountDetails>{
    return this.http.get<AccountDetails>(environment.backend_host +"/accounts/"+accountId+"/pageOperations?page="+page+"&size="+size);
  }
  public debit(accountId:string, amount:number) {
    let data = {accountId:accountId, amount:amount};
    return this.http.post(environment.backend_host + "/accounts/debit", data);
  }
  public credit(accountId:string, amount:number) {
    let data = {accountId:accountId, amount:amount};
    return this.http.post(environment.backend_host + "/accounts/credit", data);
  }
  public transfer(accountSource:string, accountDestination:string, amount:number) {
    let data={accountSource:accountSource,accountDestination:accountDestination,amount: amount};
    return this.http.post(environment.backend_host + "/accounts/transfer", data);
  }
}
