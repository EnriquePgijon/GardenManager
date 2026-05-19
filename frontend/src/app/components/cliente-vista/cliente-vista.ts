import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ServicioService } from '../../services/servicio';
import { FacturaService } from '../../services/factura';
import { Servicio } from '../../models/servicio.model';

// Componente que muestra la vista del cliente
@Component({
  selector: 'app-cliente-vista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente-vista.html',
  styleUrl: './cliente-vista.css'
})
export class ClienteVistaComponent implements OnInit {

  // Servicios del cliente
  servicios: Servicio[] = [];

  constructor(
    private authService: AuthService,
    private servicioService: ServicioService,
    private facturaService: FacturaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Al cargar el componente obtiene los servicios del cliente
  ngOnInit() {
    this.cargarServicios();
  }

  // Carga los servicios del cliente actual
  cargarServicios() {
    this.servicioService.obtenerTodos().subscribe(servicios => {
      const username = this.authService.obtenerUsername();
      this.servicios = servicios.filter(s =>
        s.cliente && s.cliente.email === username
      );
      this.cdr.detectChanges();
    });
  }

  // Genera la factura de un servicio
  generarFactura(servicio: Servicio): void {
    this.facturaService.generarFactura(servicio);
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