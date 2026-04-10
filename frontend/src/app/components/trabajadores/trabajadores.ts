import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TrabajadorService } from '../../services/trabajador';
import { Trabajador } from '../../models/trabajador.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

// Componente que gestiona la pantalla de trabajadores
@Component({
  selector: 'app-trabajadores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './trabajadores.html',
  styleUrl: './trabajadores.css'
})
export class TrabajadoresComponent implements OnInit {

  // Lista de trabajadores obtenida del backend
  trabajadores: Trabajador[] = [];

  // Trabajador seleccionado para editar o crear
  trabajadorSeleccionado: Trabajador = this.trabajadorVacio();

  // Controla si el formulario está visible
  mostrarFormulario = false;

  // Indica si estamos editando o creando
  editando = false;

 constructor(
    private trabajadorService: TrabajadorService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  // Al cargar el componente, obtiene todos los trabajadores
  ngOnInit() {
    this.cargarTrabajadores();
  }

  // Obtiene todos los trabajadores del backend
  cargarTrabajadores() {
    this.trabajadorService.obtenerTodos().subscribe(trabajadores => {
      this.trabajadores = trabajadores;
      this.cdr.detectChanges();
    });
  }

  // Devuelve un trabajador vacío para el formulario
  trabajadorVacio(): Trabajador {
    return { nombre: '', apellidos: '', telefono: '', email: '' };
  }

  // Abre el formulario para crear un trabajador nuevo
  nuevoTrabajador() {
    this.trabajadorSeleccionado = this.trabajadorVacio();
    this.editando = false;
    this.mostrarFormulario = true;
  }

  // Abre el formulario para editar un trabajador existente
  editarTrabajador(trabajador: Trabajador) {
    this.trabajadorSeleccionado = { ...trabajador };
    this.editando = true;
    this.mostrarFormulario = true;
  }

// Guarda el trabajador (crea o actualiza según el caso)
  guardarTrabajador() {
    // Validación de campos obligatorios
    if (!this.trabajadorSeleccionado.nombre || !this.trabajadorSeleccionado.apellidos || 
        !this.trabajadorSeleccionado.telefono || !this.trabajadorSeleccionado.email) {
      alert('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    if (this.editando && this.trabajadorSeleccionado.id) {
      this.trabajadorService.actualizar(this.trabajadorSeleccionado.id, this.trabajadorSeleccionado).subscribe(() => {
        this.cargarTrabajadores();
        this.mostrarFormulario = false;
      });
    } else {
      this.trabajadorService.crear(this.trabajadorSeleccionado).subscribe(() => {
        this.cargarTrabajadores();
        this.mostrarFormulario = false;
      });
    }
  }

  // Elimina un trabajador por su id
  eliminarTrabajador(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este trabajador?')) {
      this.trabajadorService.eliminar(id).subscribe(() => {
        this.cargarTrabajadores();
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