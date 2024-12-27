import {Component, OnInit} from '@angular/core';
import {JsonPipe, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomerService} from "../services/customer.service";
import {Router} from "@angular/router";
import {Customer} from "../models/customer";

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent implements OnInit{
  customer! : Customer;
  customerForm!: FormGroup;
  ngOnInit(): void {
    this.customerForm= this.formBuilder.group(
      {
        name: new FormControl(this.customer.name,[Validators.required, Validators.minLength(4)]),
        email: new FormControl(this.customer.email,[Validators.required, Validators.email]),
      }
    )
  }
  constructor(private formBuilder:FormBuilder,private customerService:CustomerService,private router:Router) {
    this.customer=this.router.getCurrentNavigation()?.extras.state as Customer;
  }
  handleSaveCustomer() {
    this.customer.name = this.customerForm.value.name
    this.customer.email = this.customerForm.value.email
    this.customerService.updateCustomer(this.customer).subscribe({
      next : data=>{
        alert("Customer has been successfully updated!");
        this.router.navigateByUrl("/admin/customers");
      },
      error : err => {
        console.log(err);
      }
    });
  }

}
