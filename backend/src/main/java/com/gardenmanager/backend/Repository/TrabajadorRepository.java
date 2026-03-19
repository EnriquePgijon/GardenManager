package com.gardenmanager.backend.Repository;

import com.gardenmanager.backend.model.Trabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositorio para acceder a los datos de los trabajadores en la base de datos
@Repository
public interface TrabajadorRepository extends JpaRepository<Trabajador, Long> {

    // Métodos básicos generados automaticamente por Springboot:
    // findAll() -> obtener todos los trabajadores
    // findById() -> buscar por id
    // save() -> guardar o actualizar un trabajador
    // deleteById() -> eliminar un trabajador
}