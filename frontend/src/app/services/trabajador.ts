import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trabajador } from '../models/trabajador.model';
import { AuthService } from './auth';

// Servicio que gestiona las operaciones con trabajadores
@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

  // URL base del backend
  private apiUrl = 'http://localhost:8080/api/trabajadores';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Genera las cabeceras con el token JWT
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.obtenerToken()}`
    });
  }

  // Obtiene todos los trabajadores
  obtenerTodos(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Obtiene un trabajador por su id
  obtenerPorId(id: number): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Crea un trabajador nuevo
  crear(trabajador: Trabajador): Observable<Trabajador> {
    return this.http.post<Trabajador>(this.apiUrl, trabajador, { headers: this.getHeaders() });
  }

  // Actualiza un trabajador existente
  actualizar(id: number, trabajador: Trabajador): Observable<Trabajador> {
    return this.http.put<Trabajador>(`${this.apiUrl}/${id}`, trabajador, { headers: this.getHeaders() });
  }

  // Elimina un trabajador por su id
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}