import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomerService} from "../services/customer.service";
import {Router} from "@angular/router";
import {Customer} from "../models/customer";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css'
})
export class NewCustomerComponent implements OnInit {
  customerForm!: FormGroup;
  ngOnInit(): void {
   this.customerForm= this.formBuilder.group(
      {
        name: new FormControl("",[Validators.required, Validators.minLength(4)]),
        email: new FormControl("",[Validators.required, Validators.email]),
      }
    )
  }
  constructor(private formBuilder:FormBuilder,private customerService:CustomerService,private router:Router) { }
  handleSaveCustomer() {
    let customer=this.customerForm.value;
    this.customerService.saveCustomer(customer).subscribe({
      next : data=>{
        alert("Customer has been successfully saved!");
        this.router.navigateByUrl("/admin/customers");
      },
      error : err => {
        console.log(err);
      }
    });
  }
}
