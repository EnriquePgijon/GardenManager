import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ServicioService } from '../../services/servicio';
import { ClienteService } from '../../services/cliente';
import { TrabajadorService } from '../../services/trabajador';
import { Servicio } from '../../models/servicio.model';
import { Cliente } from '../../models/cliente.model';
import { Trabajador } from '../../models/trabajador.model';
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

  // Filtro de estado seleccionado
  filtroEstado = '';

  // Lista de clientes para el formulario
  clientes: Cliente[] = [];

  // Lista de trabajadores para el formulario
  trabajadores: Trabajador[] = [];

  // Servicio seleccionado para editar o crear
  servicioSeleccionado: Servicio = this.servicioVacio();

  // Controla si el formulario está visible
  mostrarFormulario = false;

  // Indica si estamos editando o creando
  editando = false;

  // Mensaje de confirmación visual
  mensajeExito = '';
  mensajeError = '';

  // Tipos de servicio disponibles
  tiposServicio = ['Mantenimiento', 'Poda', 'Riego', 'Limpieza', 'Instalación'];

  // Estados posibles de un servicio
  estados = ['PENDIENTE', 'EN_PROCESO', 'FINALIZADO'];

  constructor(
    private servicioService: ServicioService,
    private clienteService: ClienteService,
    private trabajadorService: TrabajadorService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  // Al cargar el componente, obtiene todos los servicios, clientes y trabajadores
  ngOnInit() {
    this.cargarServicios();
    this.cargarClientes();
    this.cargarTrabajadores();
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

  // Obtiene todos los trabajadores para el selector del formulario
  cargarTrabajadores() {
    this.trabajadorService.obtenerTodos().subscribe(trabajadores => {
      this.trabajadores = trabajadores;
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
    if (!this.servicioSeleccionado.tipo || !this.servicioSeleccionado.fecha ||
        !this.servicioSeleccionado.cliente.id) {
      this.mensajeError = 'Por favor, rellena todos los campos obligatorios.';
      setTimeout(() => this.mensajeError = '', 3000);
      return;
    }

    if (this.editando && this.servicioSeleccionado.id) {
      this.servicioService.actualizar(this.servicioSeleccionado.id, this.servicioSeleccionado).subscribe(() => {
        this.cargarServicios();
        this.mostrarFormulario = false;
        this.mensajeExito = 'Servicio actualizado correctamente.';
        setTimeout(() => this.mensajeExito = '', 3000);
      });
    } else {
      this.servicioService.crear(this.servicioSeleccionado).subscribe(() => {
        this.cargarServicios();
        this.mostrarFormulario = false;
        this.mensajeExito = 'Servicio creado correctamente.';
        setTimeout(() => this.mensajeExito = '', 3000);
      });
    }
  }

  // Elimina un servicio por su id
  eliminarServicio(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      this.servicioService.eliminar(id).subscribe(() => {
        this.cargarServicios();
        this.mensajeError = 'Servicio eliminado correctamente.';
        setTimeout(() => this.mensajeError = '', 3000);
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

  // Filtra los servicios según el estado seleccionado
  get serviciosFiltrados(): Servicio[] {
    if (!this.filtroEstado) return this.servicios;
    return this.servicios.filter(s => s.estado === this.filtroEstado);
  }
}