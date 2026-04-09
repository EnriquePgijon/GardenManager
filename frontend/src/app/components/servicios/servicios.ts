import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServicioService } from '../../services/servicio';
import { ClienteService } from '../../services/cliente';
import { Servicio } from '../../models/servicio.model';
import { Cliente } from '../../models/cliente.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

// Componente que gestiona la pantalla de servicios
@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class ServiciosComponent implements OnInit {

  // Lista de servicios obtenida del backend
  servicios: Servicio[] = [];

  // Lista de clientes para el formulario
  clientes: Cliente[] = [];

  // Servicio seleccionado para editar o crear
  servicioSeleccionado: Servicio = this.servicioVacio();

  // Controla si el formulario está visible
  mostrarFormulario = false;

  // Indica si estamos editando o creando
  editando = false;

  // Tipos de servicio disponibles
  tiposServicio = ['Mantenimiento', 'Poda', 'Riego', 'Limpieza', 'Instalación'];

  // Estados posibles de un servicio
  estados = ['PENDIENTE', 'EN_PROCESO', 'FINALIZADO'];

  constructor(
    private servicioService: ServicioService,
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  // Al cargar el componente, obtiene todos los servicios y clientes
  ngOnInit() {
    this.cargarServicios();
    this.cargarClientes();
  }

  // Obtiene todos los servicios del backend
  cargarServicios() {
    this.servicioService.obtenerTodos().subscribe(servicios => {
      this.servicios = servicios;
      this.cdr.detectChanges();
    });
  }

  // Obtiene todos los clientes para el selector del formulario
  cargarClientes() {
    this.clienteService.obtenerTodos().subscribe(clientes => {
      this.clientes = clientes;
      this.cdr.detectChanges();
    });
  }

  // Devuelve un servicio vacío para el formulario
  servicioVacio(): Servicio {
    return {
      tipo: '',
      descripcion: '',
      fecha: '',
      estado: 'PENDIENTE',
      cliente: { nombre: '', apellidos: '', telefono: '', email: '', direccion: '' }
    };
  }

  // Abre el formulario para crear un servicio nuevo
  nuevoServicio() {
    this.servicioSeleccionado = this.servicioVacio();
    this.editando = false;
    this.mostrarFormulario = true;
  }

  // Abre el formulario para editar un servicio existente
  editarServicio(servicio: Servicio) {
    this.servicioSeleccionado = { ...servicio };
    this.editando = true;
    this.mostrarFormulario = true;
  }

  // Guarda el servicio (crea o actualiza según el caso)
  guardarServicio() {
    if (this.editando && this.servicioSeleccionado.id) {
      this.servicioService.actualizar(this.servicioSeleccionado.id, this.servicioSeleccionado).subscribe(() => {
        this.cargarServicios();
        this.mostrarFormulario = false;
      });
    } else {
      this.servicioService.crear(this.servicioSeleccionado).subscribe(() => {
        this.cargarServicios();
        this.mostrarFormulario = false;
      });
    }
  }

  // Elimina un servicio por su id
  eliminarServicio(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      this.servicioService.eliminar(id).subscribe(() => {
        this.cargarServicios();
      });
    }
  }

  // Devuelve el nombre completo del cliente de un servicio
  nombreCliente(servicio: Servicio): string {
    return `${servicio.cliente.nombre} ${servicio.cliente.apellidos}`;
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
}