import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';
import { AuthService } from './auth';

// Servicio que gestiona las operaciones con servicios de jardinería
@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  // URL base del backend
  private apiUrl = 'http://localhost:8080/api/servicios';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Genera las cabeceras con el token JWT
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.obtenerToken()}`
    });
  }

  // Obtiene todos los servicios
  obtenerTodos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Obtiene un servicio por su id
  obtenerPorId(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Obtiene los servicios de un cliente concreto
  obtenerPorCliente(clienteId: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/cliente/${clienteId}`, { headers: this.getHeaders() });
  }

  // Obtiene los servicios filtrados por estado
  obtenerPorEstado(estado: string): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/estado/${estado}`, { headers: this.getHeaders() });
  }

  // Crea un servicio nuevo
  crear(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, servicio, { headers: this.getHeaders() });
  }

  // Actualiza un servicio existente
  actualizar(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${id}`, servicio, { headers: this.getHeaders() });
  }

  // Elimina un servicio por su id
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}