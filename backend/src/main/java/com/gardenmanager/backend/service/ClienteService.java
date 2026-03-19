package com.gardenmanager.backend.service;

import com.gardenmanager.backend.model.Cliente;
import com.gardenmanager.backend.Repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Contiene la lógica de negocio relacionada con los clientes
@Service
public class ClienteService {

    // Spring inyecta automáticamente el repositorio
    @Autowired
    private ClienteRepository clienteRepository;

    // Devuelve la lista de todos los clientes
    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAll();
    }

    // Busca un cliente por su id
    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepository.findById(id);
    }

    // Guarda un cliente nuevo o actualiza uno existente
    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // Elimina un cliente por su id
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }
}