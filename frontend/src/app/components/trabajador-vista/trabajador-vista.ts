import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ServicioService } from '../../services/servicio';
import { Servicio } from '../../models/servicio.model';

// Componente que muestra la vista del trabajador
@Component({
  selector: 'app-trabajador-vista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trabajador-vista.html',
  styleUrl: './trabajador-vista.css'
})
export class TrabajadorVistaComponent implements OnInit {

  // Servicios asignados al trabajador
  servicios: Servicio[] = [];
  mensajeExito = '';

  constructor(
    private authService: AuthService,
    private servicioService: ServicioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Al cargar el componente obtiene los servicios del trabajador
  ngOnInit() {
    this.cargarServicios();
  }

  // Carga todos los servicios y filtra los del trabajador actual
  cargarServicios() {
    this.servicioService.obtenerTodos().subscribe(servicios => {
      const username = this.authService.obtenerUsername();
      this.servicios = servicios.filter(s =>
        s.trabajador && s.trabajador.email === username
      );
      this.cdr.detectChanges();
    });
  }

  // Cambia el estado de un servicio
  cambiarEstado(servicio: Servicio, nuevoEstado: string) {
    servicio.estado = nuevoEstado;
    this.servicioService.actualizar(servicio.id!, servicio).subscribe(() => {
      this.cargarServicios();
      this.mensajeExito = 'Estado actualizado correctamente.';
      setTimeout(() => this.mensajeExito = '', 3000);
      this.cdr.detectChanges();
    });
  }

  // Formatea la fecha al formato español
  formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';
    const partes = fecha.split('-');
    if (partes.length !== 3) return fecha;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // Cierra la sesión y redirige al login
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}