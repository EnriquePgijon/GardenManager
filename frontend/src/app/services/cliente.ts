import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { AuthService } from './auth';

// Servicio que gestiona las operaciones con clientes
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // URL base del backend
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Genera las cabeceras con el token JWT
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.obtenerToken()}`
    });
  }

  // Obtiene todos los clientes
  obtenerTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Obtiene un cliente por su id
  obtenerPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Crea un cliente nuevo
  crear(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente, { headers: this.getHeaders() });
  }

  // Actualiza un cliente existente
  actualizar(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente, { headers: this.getHeaders() });
  }

  // Elimina un cliente por su id
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}