import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private router: Router) { }

    // Método para verificar si el token existe y es válido
    isAuthenticated(): boolean {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return false;
        }
        // Aquí podrías verificar la expiración del token si tienes esa información
        return true; // Cambia según la lógica de expiración del token
    }

    // Método para cerrar sesión
    logout() {
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
    }
}
