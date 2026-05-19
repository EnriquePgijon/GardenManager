import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ServicioService } from '../../services/servicio';
import { ClienteService } from '../../services/cliente';
import { FacturaService } from '../../services/factura';
import { Servicio } from '../../models/servicio.model';
import { Cliente } from '../../models/cliente.model';

// Componente que muestra la vista del cliente
@Component({
  selector: 'app-cliente-vista',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cliente-vista.html',
  styleUrl: './cliente-vista.css'
})
export class ClienteVistaComponent implements OnInit {

  // Lista de clientes para el selector
  clientes: Cliente[] = [];
  // Cliente seleccionado
  clienteSeleccionado: Cliente | null = null;
  // Servicios del cliente seleccionado
  servicios: Servicio[] = [];
  // Pin introducido
  pinIntroducido = '';
  // Error de pin
  errorPin = false;
  // Vista activa
  vistaActiva = false;

  constructor(
    private authService: AuthService,
    private servicioService: ServicioService,
    private clienteService: ClienteService,
    private facturaService: FacturaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.clienteService.obtenerTodos().subscribe(clientes => {
      this.clientes = clientes;
      this.cdr.detectChanges();
    });
  }

  // Verifica el pin y carga los servicios del cliente
  entrar() {
    if (!this.clienteSeleccionado || !this.pinIntroducido) {
      this.errorPin = true;
      return;
    }

    if (this.clienteSeleccionado.pin !== this.pinIntroducido) {
      this.errorPin = true;
      return;
    }

    this.errorPin = false;
    this.servicioService.obtenerTodos().subscribe(servicios => {
      this.servicios = servicios.filter(s =>
        s.cliente && s.cliente.id === this.clienteSeleccionado!.id
      );
      this.vistaActiva = true;
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