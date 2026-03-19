package com.gardenmanager.backend.service;

import com.gardenmanager.backend.model.Trabajador;
import com.gardenmanager.backend.Repository.TrabajadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Contiene la lógica de negocio relacionada con los trabajadores
@Service
public class TrabajadorService {

    // Spring inyecta automáticamente el repositorio
    @Autowired
    private TrabajadorRepository trabajadorRepository;

    // Devuelve la lista de todos los trabajadores
    public List<Trabajador> obtenerTodos() {
        return trabajadorRepository.findAll();
    }

    // Busca un trabajador por su id
    public Optional<Trabajador> obtenerPorId(Long id) {
        return trabajadorRepository.findById(id);
    }

    // Guarda un trabajador nuevo o actualiza uno existente
    public Trabajador guardar(Trabajador trabajador) {
        return trabajadorRepository.save(trabajador);
    }

    // Elimina un trabajador por su id
    public void eliminar(Long id) {
        trabajadorRepository.deleteById(id);
    }
}