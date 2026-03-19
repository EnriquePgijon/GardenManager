package com.gardenmanager.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

// Representa un trabajador de la empresa de jardinería
@Data
@Entity
@Table(name = "trabajadores")
public class Trabajador {

    // Identificador único, se genera automáticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Datos personales del trabajador
    private String nombre;
    private String apellidos;
    private String telefono;
    private String email;

    // Servicios asignados a este trabajador
    @ManyToMany
    @JoinTable(
        name = "trabajador_servicios",
        joinColumns = @JoinColumn(name = "trabajador_id"),
        inverseJoinColumns = @JoinColumn(name = "servicio_id")
    )
    private List<Servicio> servicios;
}