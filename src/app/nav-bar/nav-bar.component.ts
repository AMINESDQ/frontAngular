import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,RouterLink
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(public authservice : AuthService,private router:Router) {
  }
  handleLogout() {
    this.authservice.logout()

  }
}
