package com.gardenmanager.backend.model;

import jakarta.persistence.*;
import lombok.Data;

// Representa un servicio de jardinería solicitado por un cliente
@Data
@Entity
@Table(name = "servicios")
public class Servicio {

    // Identificador único, se genera automáticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tipo de servicio: poda, riego, mantenimiento, limpieza...
    private String tipo;

    // Descripción detallada del trabajo a realizar
    private String descripcion;

    // Concepto de la factura para el cliente
    private String concepto;

    // Precio del servicio sin IVA
    private Double precio;

    // Fecha en la que se solicita el servicio
    private String fecha;

    // Estado del servicio: PENDIENTE, EN_PROCESO, FINALIZADO
    private String estado;

    // Cliente que ha solicitado el servicio
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Trabajador asignado al servicio
    @ManyToOne
    @JoinColumn(name = "trabajador_id")
    private Trabajador trabajador;
}