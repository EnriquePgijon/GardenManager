import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente-vista.html',
  styleUrl: './cliente-vista.css'
})
export class ClienteVistaComponent implements OnInit {

  cliente: Cliente | null = null;
  servicios: Servicio[] = [];

  constructor(
    private authService: AuthService,
    private servicioService: ServicioService,
    private clienteService: ClienteService,
    private facturaService: FacturaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const username = this.authService.obtenerUsername();
    this.clienteService.obtenerTodos().subscribe(clientes => {
      this.cliente = clientes.find(c => c.username === username) || null;
      if (this.cliente) {
        this.cargarServicios();
      }
      this.cdr.detectChanges();
    });
  }

  cargarServicios() {
    this.servicioService.obtenerTodos().subscribe(servicios => {
      this.servicios = servicios.filter(s =>
        s.cliente && s.cliente.id === this.cliente!.id
      );
      this.cdr.detectChanges();
    });
  }

  generarFactura(servicio: Servicio): void {
    this.facturaService.generarFactura(servicio);
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