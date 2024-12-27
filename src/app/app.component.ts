import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import {NavBarComponent} from "./nav-bar/nav-bar.component";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,NavBarComponent,RouterModule,  HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements  OnInit{
  title = 'front-end';
  protected readonly console = console;
constructor(private authservice:AuthService) {
}
  ngOnInit(): void {
    this.authservice.loadJwtTokenFromLocalStorage();
  }


}
