package com.gardenmanager.backend.service;

import com.gardenmanager.backend.model.Servicio;
import com.gardenmanager.backend.Repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Contiene la lógica de negocio relacionada con los servicios
@Service
public class ServicioService {

    // Spring inyecta automáticamente el repositorio
    @Autowired
    private ServicioRepository servicioRepository;

    // Devuelve la lista de todos los servicios
    public List<Servicio> obtenerTodos() {
        return servicioRepository.findAll();
    }

    // Busca un servicio por su id
    public Optional<Servicio> obtenerPorId(Long id) {
        return servicioRepository.findById(id);
    }

    // Devuelve los servicios de un cliente concreto
    public List<Servicio> obtenerPorCliente(Long clienteId) {
        return servicioRepository.findByClienteId(clienteId);
    }

    // Devuelve los servicios filtrados por estado
    public List<Servicio> obtenerPorEstado(String estado) {
        return servicioRepository.findByEstado(estado);
    }

    // Guarda un servicio nuevo o actualiza uno existente
    public Servicio guardar(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    // Elimina un servicio por su id
    public void eliminar(Long id) {
        servicioRepository.deleteById(id);
    }
}