package com.gardenmanager.backend.model;

import jakarta.persistence.*;
import lombok.Data;

// Representa un cliente de la empresa de jardinería
@Data
@Entity
@Table(name = "clientes")
public class Cliente {

    // Identificador único, se genera automáticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Datos personales del cliente
    private String nombre;
    private String apellidos;
    private String telefono;
    private String email;
    private String direccion;
}
