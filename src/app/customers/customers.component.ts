import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {catchError, map, Observable, throwError} from "rxjs";
import {Customer} from "../models/customer";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CustomerService} from "../services/customer.service";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    RouterLink
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  customers! : Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup : FormGroup | undefined;
  constructor(private customerService : CustomerService,public authService:AuthService, private fb : FormBuilder, private router : Router) { }

  ngOnInit() {
    this.searchFormGroup=this.fb.group({
      keyword : this.fb.control("")
    });
    this.handleSearchCustomers();
  }
  handleSearchCustomers() {
    let kw=this.searchFormGroup?.value.keyword;
    this.customers=this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        return throwError(err);
      })
    );
  }

  handleDeleteCustomer(c:Customer) {
    let confirmDelete=confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return;
    this.customerService.deleteCustomer(c.id).subscribe(
      {
        next: () => {
          this.customers = this.customers.pipe(
            map(data=>{
              let index=data.indexOf(c);
              console.log(data)
              data.slice(index,1);
              console.log(data)

              return data;
            })
          );
        },
        error: err => {
          this.errorMessage=err.message;
        }
      }
    )
  }

  goToAccounts(customer: Customer) {
    this.router.navigateByUrl("/admin/customer-accounts/" + customer.id , {state:customer});
  }
  goToEdit(customer: Customer) {
    this.router.navigateByUrl("/admin/edit-customer", {state:customer});
  }

  updateCustomer(id: number) {

  }
}

