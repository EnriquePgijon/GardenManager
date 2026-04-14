import { Cliente } from './cliente.model';
import { Trabajador } from './trabajador.model';

// Define la estructura de un servicio de jardinería
export interface Servicio {
    id?: number;
    tipo: string;
    descripcion: string;
    fecha: string;
    estado: string;
    cliente: Cliente;
    trabajador?: Trabajador;
}