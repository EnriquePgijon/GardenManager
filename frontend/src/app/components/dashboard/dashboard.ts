import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ClienteService } from '../../services/cliente';
import { ServicioService } from '../../services/servicio';
import { TrabajadorService } from '../../services/trabajador';

// Componente que muestra el panel principal de la aplicación
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  // Contadores para las tarjetas del dashboard
  totalClientes = 0;
  totalServicios = 0;
  totalTrabajadores = 0;
  serviciosPendientes = 0;

  constructor(
    private authService: AuthService,
    private clienteService: ClienteService,
    private servicioService: ServicioService,
    private trabajadorService: TrabajadorService,
    private router: Router
  ) {}

  // Al cargar el componente, obtiene los datos del backend
  ngOnInit() {
    this.clienteService.obtenerTodos().subscribe(clientes => {
      this.totalClientes = clientes.length;
    });

    this.trabajadorService.obtenerTodos().subscribe(trabajadores => {
      this.totalTrabajadores = trabajadores.length;
    });

    this.servicioService.obtenerTodos().subscribe(servicios => {
      this.totalServicios = servicios.length;
      this.serviciosPendientes = servicios.filter(s => s.estado === 'PENDIENTE').length;
    });
  }

  // Cierra la sesión y redirige al login
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}