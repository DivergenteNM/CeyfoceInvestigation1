import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginAlertComponent } from './components/login-alert/login-alert.component'; // Componente de alerta

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isAuthenticated()) {
            return true;
        } else {
            const dialogRef = this.dialog.open(LoginAlertComponent);

            // Esperar a que el usuario cierre la ventana emergente
            dialogRef.afterClosed().subscribe(() => {
                this.router.navigate(['./account/login']); // Redirige después de cerrar la ventana
            });

            return false;
        }
    }
}
