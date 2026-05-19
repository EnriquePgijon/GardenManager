import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ClientesComponent } from './components/clientes/clientes';
import { ServiciosComponent } from './components/servicios/servicios';
import { TrabajadoresComponent } from './components/trabajadores/trabajadores';
import { NotFoundComponent } from './components/not-found/not-found';
import { AuthGuard } from './guards/auth-guard';
import { TrabajadorVistaComponent } from './components/trabajador-vista/trabajador-vista';
import { ClienteVistaComponent } from './components/cliente-vista/cliente-vista';

// Definición de las rutas de la aplicación
export const routes: Routes = [
  // Ruta por defecto redirige al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Pantalla de inicio de sesión (pública)
  { path: 'login', component: LoginComponent },

  // Panel principal (protegido)
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Gestión de clientes (protegido)
  { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },

  // Gestión de servicios (protegido)
  { path: 'servicios', component: ServiciosComponent, canActivate: [AuthGuard] },

  // Gestión de trabajadores (protegido)
  { path: 'trabajadores', component: TrabajadoresComponent, canActivate: [AuthGuard] },
  // Vista del trabajador (protegida)
  { path: 'trabajador', component: TrabajadorVistaComponent, canActivate: [AuthGuard] },

  // Vista del cliente (protegida)
  { path: 'cliente', component: ClienteVistaComponent, canActivate: [AuthGuard] },

  // Página 404 para rutas no encontradas
  { path: '**', component: NotFoundComponent },
];