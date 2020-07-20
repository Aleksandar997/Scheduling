import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalData } from '../data/localData';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (LocalData.isLogged()) {
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
