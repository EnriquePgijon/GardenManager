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

  // Guarda el token en el navegador
  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtiene el token guardado
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // Comprueba si el usuario está autenticado
  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  // Cierra sesión eliminando el token
  cerrarSesion(): void {
    localStorage.removeItem('token');
  }
}