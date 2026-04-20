import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Servicio } from '../models/servicio.model';

// Servicio que gestiona la generación de facturas en PDF
@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  // Genera y descarga la factura de un servicio en PDF
  generarFactura(servicio: Servicio): void {
    const doc = new jsPDF();
    const fechaEmision = new Date().toLocaleDateString('es-ES');
    const numeroFactura = 'FAC-' + String(servicio.id).padStart(4, '0') + '-' + new Date().getFullYear();

    // Cálculo de precios
    const baseImponible = servicio.precio || 0;
    const iva = baseImponible * 0.21;
    const total = baseImponible + iva;

    // Colores
    const verdeOscuro: [number, number, number] = [28, 58, 42];
    const verdeMedio: [number, number, number] = [45, 90, 61];
    const dorado: [number, number, number] = [200, 169, 110];
    const crema: [number, number, number] = [245, 240, 232];
    const grisTexto: [number, number, number] = [100, 100, 100];
    const negro: [number, number, number] = [44, 44, 44];

    // Cabecera
    doc.setFillColor(...verdeOscuro);
    doc.rect(0, 0, 210, 50, 'F');

    // Franja dorada
    doc.setFillColor(...dorado);
    doc.rect(0, 50, 210, 2, 'F');

    // Logo empresa
    doc.setTextColor(...crema);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('GardenManager', 20, 24);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(106, 171, 138);
    doc.text('Servicios profesionales de jardinería', 20, 33);
    doc.text('gardenmanager@empresa.com  |  Tel: 900 000 000', 20, 41);

    // Número de factura
    doc.setTextColor(...dorado);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA', 190, 18, { align: 'right' });
    doc.setTextColor(...crema);
    doc.setFontSize(14);
    doc.text(numeroFactura, 190, 28, { align: 'right' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(106, 171, 138);
    doc.text('Fecha de emisión: ' + fechaEmision, 190, 38, { align: 'right' });

    // Sección FACTURAR A
    doc.setFillColor(...crema);
    doc.rect(15, 62, 85, 58, 'F');
    doc.setDrawColor(...dorado);
    doc.setLineWidth(0.5);
    doc.rect(15, 62, 85, 58, 'S');

    doc.setFillColor(...verdeOscuro);
    doc.rect(15, 62, 85, 10, 'F');
    doc.setTextColor(...crema);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURAR A', 57, 69, { align: 'center' });

    doc.setTextColor(...negro);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(servicio.cliente.nombre + ' ' + servicio.cliente.apellidos, 20, 82);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grisTexto);
    doc.text(servicio.cliente.direccion || 'Sin dirección', 20, 90);
    doc.text(servicio.cliente.email, 20, 98);
    doc.text(servicio.cliente.telefono, 20, 106);

    // Sección DETALLES DEL SERVICIO
    doc.setFillColor(...crema);
    doc.rect(110, 62, 85, 58, 'F');
    doc.setDrawColor(...dorado);
    doc.rect(110, 62, 85, 58, 'S');

    doc.setFillColor(...verdeOscuro);
    doc.rect(110, 62, 85, 10, 'F');
    doc.setTextColor(...crema);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLES DEL SERVICIO', 152, 69, { align: 'center' });

    doc.setTextColor(...grisTexto);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Tipo:', 115, 82);
    doc.text('Fecha:', 115, 90);
    doc.text('Estado:', 115, 98);
    doc.text('Trabajador:', 115, 106);

    doc.setTextColor(...negro);
    doc.setFont('helvetica', 'bold');
    doc.text(servicio.tipo, 145, 82);
    doc.setFont('helvetica', 'normal');
    doc.text(servicio.fecha, 145, 90);
    doc.text(servicio.estado, 145, 98);
    const nombreTrabajador = servicio.trabajador
      ? servicio.trabajador.nombre + ' ' + servicio.trabajador.apellidos
      : 'Sin asignar';
    doc.text(nombreTrabajador, 145, 106);

    // Tabla de conceptos
    doc.setFillColor(...verdeOscuro);
    doc.rect(15, 132, 180, 10, 'F');
    doc.setTextColor(...crema);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('CONCEPTO', 20, 139);
    doc.text('IMPORTE', 185, 139, { align: 'right' });

    doc.setFillColor(250, 247, 242);
    doc.rect(15, 142, 180, 20, 'F');
    doc.setDrawColor(224, 216, 200);
    doc.rect(15, 142, 180, 20, 'S');

    doc.setTextColor(...negro);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const concepto = servicio.concepto || servicio.descripcion || 'Servicio de jardinería';
    const conceptoLines = doc.splitTextToSize(concepto, 140);
    doc.text(conceptoLines, 20, 150);
    doc.setFont('helvetica', 'bold');
    doc.text(baseImponible.toFixed(2) + ' €', 185, 150, { align: 'right' });

    // Totales
    doc.setDrawColor(...dorado);
    doc.setLineWidth(0.5);
    doc.line(120, 172, 195, 172);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grisTexto);
    doc.text('Base imponible:', 125, 180);
    doc.text('IVA (21%):', 125, 188);

    doc.setTextColor(...negro);
    doc.text(baseImponible.toFixed(2) + ' €', 185, 180, { align: 'right' });
    doc.text(iva.toFixed(2) + ' €', 185, 188, { align: 'right' });

    doc.setFillColor(...verdeOscuro);
    doc.rect(120, 193, 75, 12, 'F');
    doc.setTextColor(...crema);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 125, 201);
    doc.setTextColor(...dorado);
    doc.text(total.toFixed(2) + ' €', 185, 201, { align: 'right' });

    // Nota de agradecimiento
    doc.setFillColor(...crema);
    doc.rect(15, 215, 180, 20, 'F');
    doc.setDrawColor(...dorado);
    doc.rect(15, 215, 180, 20, 'S');
    doc.setTextColor(...verdeOscuro);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Gracias por confiar en GardenManager para el cuidado de sus espacios verdes.', 105, 224, { align: 'center' });
    doc.text('Para cualquier consulta, no dude en contactarnos.', 105, 230, { align: 'center' });

    // Pie de página
    doc.setFillColor(...verdeOscuro);
    doc.rect(0, 272, 210, 28, 'F');
    doc.setFillColor(...dorado);
    doc.rect(0, 272, 210, 1.5, 'F');

    doc.setTextColor(106, 171, 138);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('GardenManager — Servicios profesionales de jardinería', 105, 281, { align: 'center' });
    doc.setTextColor(...dorado);
    doc.text('www.gardenmanager.es  |  gardenmanager@empresa.com  |  Tel: 900 000 000', 105, 289, { align: 'center' });

    // Descargar
    doc.save('Factura_' + numeroFactura + '.pdf');
  }
    // Genera y descarga un PDF con el listado completo de clientes
  exportarClientes(clientes: any[]): void {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-ES');

    // Colores
    const verdeOscuro: [number, number, number] = [28, 58, 42];
    const dorado: [number, number, number] = [200, 169, 110];
    const crema: [number, number, number] = [245, 240, 232];
    const grisTexto: [number, number, number] = [100, 100, 100];

    // Cabecera
    doc.setFillColor(...verdeOscuro);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFillColor(...dorado);
    doc.rect(0, 40, 210, 1.5, 'F');

    doc.setTextColor(...crema);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('GardenManager', 20, 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(106, 171, 138);
    doc.text('Listado de clientes — Generado el ' + fecha, 20, 28);

    doc.setTextColor(...dorado);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL: ' + clientes.length + ' clientes', 190, 22, { align: 'right' });

    // Cabecera tabla
    doc.setFillColor(...verdeOscuro);
    doc.rect(15, 50, 180, 10, 'F');
    doc.setTextColor(...crema);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('NOMBRE', 20, 57);
    doc.text('TELÉFONO', 85, 57);
    doc.text('EMAIL', 120, 57);
   

    // Filas de clientes
    let y = 60;
    clientes.forEach((cliente, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
        doc.setFillColor(...verdeOscuro);
        doc.rect(15, y, 180, 10, 'F');
        doc.setTextColor(...crema);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('NOMBRE', 20, y + 7);
        doc.text('TELÉFONO', 85, y + 7);
        doc.text('EMAIL', 120, y + 7);
        doc.text('DIRECCIÓN', 165, y + 7);
        y += 10;
      }

      if (index % 2 === 0) {
        doc.setFillColor(250, 247, 242);
        doc.rect(15, y, 180, 12, 'F');
      }

      doc.setTextColor(44, 44, 44);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(cliente.nombre + ' ' + cliente.apellidos, 20, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...grisTexto);
      doc.text(cliente.telefono || '', 85, y + 8);
      doc.text(cliente.email || '', 120, y + 8);
      

      doc.setDrawColor(224, 216, 200);
      doc.setLineWidth(0.3);
      doc.line(15, y + 12, 195, y + 12);

      y += 12;
    });

    // Pie de página
    doc.setFillColor(...verdeOscuro);
    doc.rect(0, 272, 210, 28, 'F');
    doc.setFillColor(...dorado);
    doc.rect(0, 272, 210, 1.5, 'F');
    doc.setTextColor(106, 171, 138);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('GardenManager — Servicios profesionales de jardinería', 105, 283, { align: 'center' });
    doc.setTextColor(...dorado);
    doc.text('Documento generado automáticamente', 105, 291, { align: 'center' });

    doc.save('Clientes_GardenManager_' + fecha.replace(/\//g, '-') + '.pdf');
  }
}