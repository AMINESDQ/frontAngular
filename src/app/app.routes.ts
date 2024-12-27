import { Routes } from '@angular/router';
import {CustomersComponent} from "./customers/customers.component";
import {NewCustomerComponent} from "./new-customer/new-customer.component";
import {CustomerAccountComponent} from "./customer-account/customer-account.component";
import {AccountsComponent} from "./accounts/accounts.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {AdminTemplateComponent} from "./admin-template/admin-template.component";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {EditCustomerComponent} from "./edit-customer/edit-customer.component";
import {NotAutorizedComponent} from "./not-autorized/not-autorized.component";
import {AuthorizationGuard} from "./guards/authorization.guard";

export const routes: Routes = [
  {path:"login", component: LoginComponent},
  {path:"", component: HomeComponent},
  {path:"admin",component:AdminTemplateComponent, canActivate:[AuthenticationGuard],children:[
      {path:'customers', component: CustomersComponent},
      {path:'new-customer', component: NewCustomerComponent , canActivate:[AuthorizationGuard],data : {roles:['ADMIN']} },
      {path:'edit-customer', component: EditCustomerComponent},
      {path:'accounts', component: AccountsComponent},
      {path:'notAuthorized', component: NotAutorizedComponent},
      {path:'customer-account', component: CustomerAccountComponent },
      {path :"customer-accounts/:id", component : CustomerAccountComponent},
    ],},

];
