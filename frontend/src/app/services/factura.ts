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
    const dorado: [number, number, number] = [200, 169, 110];
    const crema: [number, number, number] = [245, 240, 232];
    const grisTexto: [number, number, number] = [100, 100, 100];
    const negro: [number, number, number] = [44, 44, 44];

    // Cabecera
    doc.setFillColor(...verdeOscuro);
    doc.rect(0, 0, 210, 52, 'F');
    doc.setFillColor(...dorado);
    doc.rect(0, 52, 210, 2, 'F');

    // Círculo dorado del logo
    doc.setFillColor(...dorado);
    doc.circle(28, 26, 12, 'F');
    doc.setTextColor(...verdeOscuro);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('G', 24, 31);

    // Nombre empresa en una sola línea
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...crema);
    doc.text('Garden', 46, 30);
    doc.setTextColor(...dorado);
    doc.setFontSize(22);
    const gardenW = doc.getTextWidth('Garden');
    doc.text('Manager', 46 + gardenW + 2, 30);

    // Subtítulo empresa
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(106, 171, 138);
    doc.text('Servicios profesionales de jardinería  |  gardenmanager@empresa.com  |  Tel: 900 000 000', 46, 40);

    // Número de factura
    doc.setTextColor(...dorado);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA', 190, 16, { align: 'right' });
    doc.setTextColor(...crema);
    doc.setFontSize(16);
    doc.text(numeroFactura, 190, 28, { align: 'right' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(106, 171, 138);
    doc.text('Fecha de emisión: ' + fechaEmision, 190, 38, { align: 'right' });

    // Sección FACTURAR A
    doc.setFillColor(...crema);
    doc.rect(15, 64, 85, 58, 'F');
    doc.setDrawColor(...dorado);
    doc.setLineWidth(0.5);
    doc.rect(15, 64, 85, 58, 'S');
    doc.setFillColor(...verdeOscuro);
    doc.rect(15, 64, 85, 10, 'F');
    doc.setTextColor(...crema);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURAR A', 57, 71, { align: 'center' });

    doc.setTextColor(...negro);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(servicio.cliente.nombre + ' ' + servicio.cliente.apellidos, 20, 84);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grisTexto);
    doc.text(servicio.cliente.direccion || 'Sin dirección', 20, 92);
    doc.text(servicio.cliente.email, 20, 100);
    doc.text(servicio.cliente.telefono, 20, 108);

    // Sección DETALLES DEL SERVICIO
    doc.setFillColor(...crema);
    doc.rect(110, 64, 85, 58, 'F');
    doc.setDrawColor(...dorado);
    doc.rect(110, 64, 85, 58, 'S');
    doc.setFillColor(...verdeOscuro);
    doc.rect(110, 64, 85, 10, 'F');
    doc.setTextColor(...crema);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLES DEL SERVICIO', 152, 71, { align: 'center' });

    doc.setTextColor(...grisTexto);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Tipo:', 115, 84);
    doc.text('Fecha:', 115, 92);
    doc.text('Estado:', 115, 100);
    doc.text('Trabajador:', 115, 108);

    doc.setTextColor(...negro);
    doc.setFont('helvetica', 'bold');
    doc.text(servicio.tipo, 145, 84);
    doc.setFont('helvetica', 'normal');
    doc.text(servicio.fecha, 145, 92);
    doc.text(servicio.estado, 145, 100);
    const nombreTrabajador = servicio.trabajador
      ? servicio.trabajador.nombre + ' ' + servicio.trabajador.apellidos
      : 'Sin asignar';
    doc.text(nombreTrabajador, 145, 108);

    // Tabla de conceptos
    doc.setFillColor(...verdeOscuro);
    doc.rect(15, 134, 180, 10, 'F');
    doc.setTextColor(...crema);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('CONCEPTO', 20, 141);
    doc.text('IMPORTE', 185, 141, { align: 'right' });

    doc.setFillColor(250, 247, 242);
    doc.rect(15, 144, 180, 20, 'F');
    doc.setDrawColor(224, 216, 200);
    doc.rect(15, 144, 180, 20, 'S');

    doc.setTextColor(...negro);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const concepto = servicio.concepto || servicio.descripcion || 'Servicio de jardinería';
    const conceptoLines = doc.splitTextToSize(concepto, 140);
    doc.text(conceptoLines, 20, 152);
    doc.setFont('helvetica', 'bold');
    doc.text(baseImponible.toFixed(2) + ' €', 185, 152, { align: 'right' });

    // Totales
    doc.setDrawColor(...dorado);
    doc.setLineWidth(0.5);
    doc.line(120, 174, 195, 174);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grisTexto);
    doc.text('Base imponible:', 125, 182);
    doc.text('IVA (21%):', 125, 190);

    doc.setTextColor(...negro);
    doc.text(baseImponible.toFixed(2) + ' €', 185, 182, { align: 'right' });
    doc.text(iva.toFixed(2) + ' €', 185, 190, { align: 'right' });

    doc.setFillColor(...verdeOscuro);
    doc.rect(120, 195, 75, 12, 'F');
    doc.setTextColor(...crema);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 125, 203);
    doc.setTextColor(...dorado);
    doc.text(total.toFixed(2) + ' €', 185, 203, { align: 'right' });

    // Nota de agradecimiento
    doc.setFillColor(...crema);
    doc.rect(15, 217, 180, 20, 'F');
    doc.setDrawColor(...dorado);
    doc.rect(15, 217, 180, 20, 'S');
    doc.setTextColor(...verdeOscuro);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Gracias por confiar en GardenManager para el cuidado de sus espacios verdes.', 105, 226, { align: 'center' });
    doc.text('Para cualquier consulta, no dude en contactarnos.', 105, 232, { align: 'center' });

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
    doc.rect(0, 0, 210, 42, 'F');
    doc.setFillColor(...dorado);
    doc.rect(0, 42, 210, 1.5, 'F');

    // Círculo dorado del logo
    doc.setFillColor(...dorado);
    doc.circle(24, 21, 10, 'F');
    doc.setTextColor(...verdeOscuro);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('G', 20, 26);

    // Nombre empresa en una sola línea
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...crema);
    doc.text('Garden', 40, 25);
    doc.setTextColor(...dorado);
    const gardenW2 = doc.getTextWidth('Garden');
    doc.text('Manager', 40 + gardenW2 + 2, 25);

    // Subtítulo
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(106, 171, 138);
    doc.text('Listado de clientes — Generado el ' + fecha, 40, 33);

    // Total clientes
    doc.setTextColor(...dorado);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL: ' + clientes.length + ' clientes', 190, 22, { align: 'right' });

    // Cabecera tabla
    doc.setFillColor(...verdeOscuro);
    doc.rect(15, 52, 180, 10, 'F');
    doc.setTextColor(...crema);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('NOMBRE', 20, 59);
    doc.text('TELÉFONO', 85, 59);
    doc.text('EMAIL', 130, 59);

    // Filas de clientes
    let y = 62;
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
        doc.text('EMAIL', 130, y + 7);
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
      doc.text(cliente.email || '', 130, y + 8);

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