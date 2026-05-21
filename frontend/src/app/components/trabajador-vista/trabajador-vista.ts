import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ServicioService } from '../../services/servicio';
import { TrabajadorService } from '../../services/trabajador';
import { Servicio } from '../../models/servicio.model';
import { Trabajador } from '../../models/trabajador.model';

// Componente que muestra la vista del trabajador
@Component({
  selector: 'app-trabajador-vista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trabajador-vista.html',
  styleUrl: './trabajador-vista.css'
})
export class TrabajadorVistaComponent implements OnInit {

  trabajador: Trabajador | null = null;
  servicios: Servicio[] = [];
  mensajeExito = '';

  constructor(
    private authService: AuthService,
    private servicioService: ServicioService,
    private trabajadorService: TrabajadorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const username = this.authService.obtenerUsername();
    this.trabajadorService.obtenerTodos().subscribe(trabajadores => {
      this.trabajador = trabajadores.find(t => t.username === username) || null;
      if (this.trabajador) {
        this.cargarServicios();
      }
      this.cdr.detectChanges();
    });
  }

  cargarServicios() {
    this.servicioService.obtenerTodos().subscribe(servicios => {
      this.servicios = servicios.filter(s =>
        s.trabajador && s.trabajador.id === this.trabajador!.id
      );
      this.cdr.detectChanges();
    });
  }

  cambiarEstado(servicio: Servicio, nuevoEstado: string) {
    servicio.estado = nuevoEstado;
    this.servicioService.actualizar(servicio.id!, servicio).subscribe(() => {
      this.cargarServicios();
      this.mensajeExito = 'Estado actualizado correctamente.';
      setTimeout(() => this.mensajeExito = '', 3000);
      this.cdr.detectChanges();
    });
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';
    const partes = fecha.split('-');
    if (partes.length !== 3) return fecha;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}