import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ServicioService } from '../../services/servicio';
import { TrabajadorService } from '../../services/trabajador';
import { Servicio } from '../../models/servicio.model';
import { Trabajador } from '../../models/trabajador.model';

// Componente que muestra la vista del trabajador
@Component({
  selector: 'app-trabajador-vista',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './trabajador-vista.html',
  styleUrl: './trabajador-vista.css'
})
export class TrabajadorVistaComponent implements OnInit {

  // Lista de trabajadores para el selector
  trabajadores: Trabajador[] = [];
  // Trabajador seleccionado
  trabajadorSeleccionado: Trabajador | null = null;
  // Servicios del trabajador seleccionado
  servicios: Servicio[] = [];
  mensajeExito = '';
  vistaActiva = false;

    // Pin introducido por el trabajador
  pinIntroducido = '';

  // Error de pin incorrecto
  errorPin = false;
  constructor(
    private authService: AuthService,
    private servicioService: ServicioService,
    private trabajadorService: TrabajadorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.trabajadorService.obtenerTodos().subscribe(trabajadores => {
      this.trabajadores = trabajadores;
      this.cdr.detectChanges();
    });
  }

  entrar() {
    if (!this.trabajadorSeleccionado || !this.pinIntroducido) {
      this.errorPin = true;
      return;
    }

    if (this.trabajadorSeleccionado.pin !== this.pinIntroducido) {
      this.errorPin = true;
      return;
    }

    this.errorPin = false;
    this.servicioService.obtenerTodos().subscribe(servicios => {
      this.servicios = servicios.filter(s =>
        s.trabajador && s.trabajador.id === this.trabajadorSeleccionado!.id
      );
      this.vistaActiva = true;
      this.cdr.detectChanges();
    });
  }

  // Cambia el estado de un servicio
  cambiarEstado(servicio: Servicio, nuevoEstado: string) {
    servicio.estado = nuevoEstado;
    this.servicioService.actualizar(servicio.id!, servicio).subscribe(() => {
      this.entrar();
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