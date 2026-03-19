package com.gardenmanager.backend.controller;

import com.gardenmanager.backend.model.Servicio;
import com.gardenmanager.backend.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador que gestiona las peticiones HTTP relacionadas con los servicios
@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {

    // Spring inyecta automáticamente el servicio
    @Autowired
    private ServicioService servicioService;

    // GET /api/servicios -> devuelve todos los servicios
    @GetMapping
    public List<Servicio> obtenerTodos() {
        return servicioService.obtenerTodos();
    }

    // GET /api/servicios/{id} -> devuelve un servicio por su id
    @GetMapping("/{id}")
    public ResponseEntity<Servicio> obtenerPorId(@PathVariable Long id) {
        return servicioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/servicios/cliente/{clienteId} -> devuelve los servicios de un cliente
    @GetMapping("/cliente/{clienteId}")
    public List<Servicio> obtenerPorCliente(@PathVariable Long clienteId) {
        return servicioService.obtenerPorCliente(clienteId);
    }

    // GET /api/servicios/estado/{estado} -> devuelve los servicios por estado
    @GetMapping("/estado/{estado}")
    public List<Servicio> obtenerPorEstado(@PathVariable String estado) {
        return servicioService.obtenerPorEstado(estado);
    }

    // POST /api/servicios -> crea un servicio nuevo
    @PostMapping
    public Servicio crear(@RequestBody Servicio servicio) {
        return servicioService.guardar(servicio);
    }

    // PUT /api/servicios/{id} -> actualiza un servicio existente
    @PutMapping("/{id}")
    public ResponseEntity<Servicio> actualizar(@PathVariable Long id, @RequestBody Servicio servicio) {
        return servicioService.obtenerPorId(id)
                .map(s -> {
                    servicio.setId(id);
                    return ResponseEntity.ok(servicioService.guardar(servicio));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/servicios/{id} -> elimina un servicio
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicioService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}