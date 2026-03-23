import { Servicio } from './servicio.model';

// Estructura de un trabajador de la empresa
export interface Trabajador {
    id?: number;
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    servicios?: Servicio[];
}