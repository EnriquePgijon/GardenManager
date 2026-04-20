import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente';
import { Cliente } from '../../models/cliente.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ServicioService } from '../../services/servicio';
import { Servicio } from '../../models/servicio.model';
import { FacturaService } from '../../services/factura';
// Componente que gestiona la pantalla de clientes
@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent implements OnInit {

  // Lista de clientes obtenida del backend
  clientes: Cliente[] = [];

  // Término de búsqueda para filtrar clientes
  busqueda = '';
  // Cliente seleccionado para editar o crear
  clienteSeleccionado: Cliente = this.clienteVacio();

  // Controla si el formulario está visible
  mostrarFormulario = false;

  // Indica si estamos editando o creando
  editando = false;

  // Cliente seleccionado para ver su historial
  clienteHistorial: any = null;

  // Servicios del cliente seleccionado
  historialServicios: Servicio[] = [];
  // Mensaje de confirmación visual
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private clienteService: ClienteService,
    private servicioService: ServicioService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    private facturaService: FacturaService,
  ) {}

  // Al cargar el componente, obtiene todos los clientes
  ngOnInit() {
    this.cargarClientes();
  }

  // Obtiene todos los clientes del backend
  cargarClientes() {
    this.clienteService.obtenerTodos().subscribe(clientes => {
      console.log('Clientes recibidos:', clientes);
      this.clientes = clientes;
      this.cdr.detectChanges();
    });
  }

  // Devuelve un cliente vacío para el formulario
  clienteVacio(): Cliente {
    return { nombre: '', apellidos: '', telefono: '', email: '', direccion: '' };
  }

  // Abre el formulario para crear un cliente nuevo
  nuevoCliente() {
    this.clienteSeleccionado = this.clienteVacio();
    this.editando = false;
    this.mostrarFormulario = true;
  }

  // Abre el formulario para editar un cliente existente
  editarCliente(cliente: Cliente) {
    this.clienteSeleccionado = { ...cliente };
    this.editando = true;
    this.mostrarFormulario = true;
  }

 // Guarda el cliente (crea o actualiza según el caso)
  guardarCliente() {
  if (!this.clienteSeleccionado.nombre || !this.clienteSeleccionado.apellidos ||
      !this.clienteSeleccionado.telefono || !this.clienteSeleccionado.email) {
    this.mensajeError = 'Por favor, rellena todos los campos obligatorios.';
    setTimeout(() => this.mensajeError = '', 3000);
    return;
  }

  if (this.editando && this.clienteSeleccionado.id) {
    this.clienteService.actualizar(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe(() => {
      this.cargarClientes();
      this.mostrarFormulario = false;
      this.mensajeExito = 'Cliente actualizado correctamente.';
      setTimeout(() => this.mensajeExito = '', 3000);
    });
  } else {
    this.clienteService.crear(this.clienteSeleccionado).subscribe(() => {
      this.cargarClientes();
      this.mostrarFormulario = false;
      this.mensajeExito = 'Cliente creado correctamente.';
      setTimeout(() => this.mensajeExito = '', 3000);
    });
  }
  }

  // Elimina un cliente por su id
 eliminarCliente(id: number) {
  if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
    this.clienteService.eliminar(id).subscribe(() => {
      this.cargarClientes();
      this.mensajeError = 'Cliente eliminado correctamente.';
      setTimeout(() => this.mensajeError = '', 3000);
    });
  }
  }

  // Cierra el formulario sin guardar
  cancelar() {
    this.mostrarFormulario = false;
  }
  
  // Cierra la sesión y redirige al login
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  // Filtra los clientes según el término de búsqueda
  get clientesFiltrados(): Cliente[] {
  if (!this.busqueda) return this.clientes;
  const termino = this.busqueda.toLowerCase();
  return this.clientes.filter(c =>
    c.nombre.toLowerCase().includes(termino) ||
    c.apellidos.toLowerCase().includes(termino) ||
    c.email.toLowerCase().includes(termino) ||
    c.telefono.includes(termino)
  );
  }
  // Muestra el historial de servicios de un cliente
  verHistorial(cliente: any) {
    if (this.clienteHistorial?.id === cliente.id) {
      this.clienteHistorial = null;
      this.historialServicios = [];
      return;
    }
    this.clienteHistorial = cliente;
    this.servicioService.obtenerPorCliente(cliente.id).subscribe(servicios => {
      this.historialServicios = servicios;
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

  // Exporta el listado de clientes a PDF
  exportarPDF(): void {
    this.facturaService.exportarClientes(this.clientes);
  }
}