import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { AuthGuard } from './guards/auth-guard';

// Definición de las rutas de la aplicación
export const routes: Routes = [
  // Ruta por defecto redirige al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Pantalla de inicio de sesión (pública)
  { path: 'login', component: LoginComponent },
];