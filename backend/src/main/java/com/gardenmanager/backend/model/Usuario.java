package com.gardenmanager.backend.model;

import jakarta.persistence.*;
import lombok.Data;

// Representa un usuario del sistema con acceso a la plataforma
@Data
@Entity
@Table(name = "usuarios")
public class Usuario {

    // Identificador único, se genera automáticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre de usuario para iniciar sesión
    @Column(unique = true)
    private String username;

    // Contraseña cifrada del usuario
    private String password;

    // Rol del usuario: ADMIN o TRABAJADOR
    private String rol;
}