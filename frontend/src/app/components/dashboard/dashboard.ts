import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ClienteService } from '../../services/cliente';
import { ServicioService } from '../../services/servicio';
import { TrabajadorService } from '../../services/trabajador';
import { Servicio } from '../../models/servicio.model';

// Componente que muestra el panel principal de la aplicación
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  // Contadores para las tarjetas del dashboard
  totalClientes = 0;
  totalServicios = 0;
  totalTrabajadores = 0;
  serviciosPendientes = 0;

  serviciosEnProceso = 0;
  serviciosFinalizados = 0;
  // Últimos servicios para mostrar en la tabla
  ultimosServicios: Servicio[] = [];

  constructor(
    private authService: AuthService,
    private clienteService: ClienteService,
    private servicioService: ServicioService,
    private trabajadorService: TrabajadorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Al cargar el componente, obtiene los datos del backend
  ngOnInit() {
    this.clienteService.obtenerTodos().subscribe(clientes => {
      this.totalClientes = clientes.length;
      this.cdr.detectChanges();
    });

    this.trabajadorService.obtenerTodos().subscribe(trabajadores => {
      this.totalTrabajadores = trabajadores.length;
      this.cdr.detectChanges();
    });

      this.servicioService.obtenerTodos().subscribe(servicios => {
      this.totalServicios = servicios.length;
      this.serviciosPendientes = servicios.filter(s => s.estado === 'PENDIENTE').length;
      this.serviciosEnProceso = servicios.filter(s => s.estado === 'EN_PROCESO').length;
      this.serviciosFinalizados = servicios.filter(s => s.estado === 'FINALIZADO').length;
      this.ultimosServicios = servicios.slice(-3).reverse();
      this.cdr.detectChanges();
    });
  }

  // Cierra la sesión y redirige al login
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}