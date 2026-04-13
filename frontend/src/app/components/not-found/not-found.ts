import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// Componente que muestra la página 404
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFoundComponent {}