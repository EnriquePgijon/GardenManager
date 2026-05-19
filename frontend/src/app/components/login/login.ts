import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Componente que gestiona la pantalla de inicio de sesión
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  // Datos del formulario de login
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Gestiona el envío del formulario de login
  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (respuesta) => {
        // Guarda el token y el rol
        this.authService.guardarToken(respuesta.token);
        this.authService.guardarRol(respuesta.rol);
        this.authService.guardarUsername(this.username);

        // Redirige según el rol del usuario
        if (respuesta.rol === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else if (respuesta.rol === 'TRABAJADOR') {
          this.router.navigate(['/trabajador']);
        } else if (respuesta.rol === 'CLIENTE') {
          this.router.navigate(['/cliente']);
        }
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}