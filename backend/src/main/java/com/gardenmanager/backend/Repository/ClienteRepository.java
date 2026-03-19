package com.gardenmanager.backend.Repository;

import com.gardenmanager.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositorio para acceder a los datos de los clientes en la base de datos
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Spring Boot genera automáticamente los métodos básicos:
    // findAll() -> obtener todos los clientes
    // findById() -> buscar por id
    // save() -> guardar o actualizar un cliente
    // deleteById() -> eliminar un cliente
}