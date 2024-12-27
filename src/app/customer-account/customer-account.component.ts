import { Component } from '@angular/core';
import {Customer} from "../models/customer";
import {ActivatedRoute, Router} from "@angular/router";
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {CustomerService} from "../services/customer.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {catchError, throwError} from "rxjs";

@Component({
  selector: 'app-customer-account',
  standalone: true,
  imports: [
    JsonPipe,
    AsyncPipe,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './customer-account.component.html',
  styleUrl: './customer-account.component.css'
})
export class CustomerAccountComponent {
  customerId! : string ;
  customer! : Customer;
  accounts: any;
  private errorMessage: any;
  constructor(private route : ActivatedRoute, private router :Router ,private customerService:CustomerService) {
    this.customer=this.router.getCurrentNavigation()?.extras.state as Customer;
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.accounts=this.customerService.getCustomerAccountsById(Number(this.customerId)).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        return throwError(err);
      })
    );

  }
}
