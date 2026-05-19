import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Servicio que gestiona la autenticación con el backend
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base del backend
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // Inicia sesión y devuelve el token JWT
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  // Registra un nuevo usuario
  registro(username: string, password: string, rol: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, { username, password, rol });
  }

    guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Guarda el nombre de usuario en el navegador
  guardarUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  // Obtiene el token guardado
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // Comprueba si el usuario está autenticado
  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

    // Cierra sesión eliminando el token y el rol
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
    // Guarda el rol del usuario en el navegador
  guardarRol(rol: string): void {
    localStorage.setItem('rol', rol);
  }

  // Obtiene el rol del usuario guardado
  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }

  // Comprueba si el usuario es administrador
  esAdmin(): boolean {
    return this.obtenerRol() === 'ADMIN';
  }

  // Comprueba si el usuario es trabajador
  esTrabajador(): boolean {
    return this.obtenerRol() === 'TRABAJADOR';
  }

  // Comprueba si el usuario es cliente
  esCliente(): boolean {
    return this.obtenerRol() === 'CLIENTE';
  }

    // Obtiene el nombre de usuario guardado
  obtenerUsername(): string | null {
    return localStorage.getItem('username');
  }
}