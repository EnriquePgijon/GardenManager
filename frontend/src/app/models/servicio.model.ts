import { Cliente } from './cliente.model';

// Estructura de un servicio de la empresa de jardinería
export interface Servicio {
    id?: number;
    tipo: string;
    descripcion: string;
    fecha: string;
    estado: string;
    cliente: Cliente;
}