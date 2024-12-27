import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn, GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(private authservice:AuthService, private router:Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): MaybeAsync<GuardResult> {
    if(this.authservice.roles.includes(route.data['roles'])){
      return true;
    }else {
      this.router.navigateByUrl("/admin/notAuthorized");
      return false;
    }
  }

}
