import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente';
import { Cliente } from '../../models/cliente.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

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

  // Cliente seleccionado para editar o crear
  clienteSeleccionado: Cliente = this.clienteVacio();

  // Controla si el formulario está visible
  mostrarFormulario = false;

  // Indica si estamos editando o creando
  editando = false;

constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
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
    if (this.editando && this.clienteSeleccionado.id) {
      this.clienteService.actualizar(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe(() => {
        this.cargarClientes();
        this.mostrarFormulario = false;
      });
    } else {
      this.clienteService.crear(this.clienteSeleccionado).subscribe(() => {
        this.cargarClientes();
        this.mostrarFormulario = false;
      });
    }
  }

  // Elimina un cliente por su id
  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.clienteService.eliminar(id).subscribe(() => {
        this.cargarClientes();
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
}