import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(private fb:FormBuilder,private auth:AuthService ,private route:Router) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  submitLogin() {
    let username = this.formGroup.get('username')?.value;
    let password = this.formGroup.get('password')?.value;
    this.auth.login(username, password).subscribe(
      {
        next: (data) => {
          this.auth.laodProfile(data);
          this.route.navigateByUrl("admin/customers");
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }
}
