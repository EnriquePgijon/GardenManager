
// Estructura de un cliente
export interface Cliente {
    id?: number;
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    pin?: string;
    direccion: string;
}