import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Guard que protege las rutas para que solo accedan usuarios autenticados
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // Comprueba si el usuario está autenticado antes de acceder a una ruta
  canActivate(): boolean {
    if (this.authService.estaAutenticado()) {
      return true;
    } else {
      // Si no está autenticado, redirige al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}