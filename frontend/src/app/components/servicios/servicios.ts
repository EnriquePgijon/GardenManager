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
import { FacturaService } from '../../services/factura';
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

  // Término de búsqueda para filtrar servicios
  busqueda = '';
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
    private router: Router,
    private facturaService: FacturaService
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

  servicioVacio(): Servicio {
  return {
    tipo: '',
    descripcion: '',
    concepto: '',
    precio: 0,
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
    
    // Busca el cliente en la lista para que el selector lo reconozca
    const clienteEncontrado = this.clientes.find(c => c.id === servicio.cliente.id);
    if (clienteEncontrado) {
      this.servicioSeleccionado.cliente = clienteEncontrado;
    }

    // Busca el trabajador en la lista para que el selector lo reconozca
    if (servicio.trabajador) {
      const trabajadorEncontrado = this.trabajadores.find(t => t.id === servicio.trabajador!.id);
      if (trabajadorEncontrado) {
        this.servicioSeleccionado.trabajador = trabajadorEncontrado;
      }
    }

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

  

    // Filtra los servicios según el término de búsqueda y el estado
  get serviciosFiltrados(): Servicio[] {
    let resultado = this.servicios;
    if (this.filtroEstado) {
      resultado = resultado.filter(s => s.estado === this.filtroEstado);
    }
    if (this.busqueda) {
      const termino = this.busqueda.toLowerCase();
      resultado = resultado.filter(s =>
        s.tipo.toLowerCase().includes(termino) ||
        s.cliente.nombre.toLowerCase().includes(termino) ||
        s.cliente.apellidos.toLowerCase().includes(termino)
      );
    }
    return resultado;
  }
    // Cambia el estado de un servicio directamente desde la tabla
  cambiarEstado(servicio: Servicio, nuevoEstado: string) {
    servicio.estado = nuevoEstado;
    this.servicioService.actualizar(servicio.id!, servicio).subscribe(() => {
      this.cargarServicios();
      this.mensajeExito = 'Estado actualizado correctamente.';
      setTimeout(() => this.mensajeExito = '', 3000);
    });
  }

    // Genera y descarga la factura de un servicio en PDF
  generarFactura(servicio: Servicio): void {
    this.facturaService.generarFactura(servicio);
  }

    // Convierte una fecha del formato yyyy-mm-dd al formato español dd/mm/yyyy
  formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';
    const partes = fecha.split('-');
    if (partes.length !== 3) return fecha;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
}