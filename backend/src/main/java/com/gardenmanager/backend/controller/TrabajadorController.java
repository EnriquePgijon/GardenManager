package com.gardenmanager.backend.controller;

import com.gardenmanager.backend.model.Trabajador;
import com.gardenmanager.backend.service.TrabajadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador que gestiona las peticiones HTTP relacionadas con los trabajadores
@RestController
@RequestMapping("/api/trabajadores")
@CrossOrigin(origins = "*")
public class TrabajadorController {

    // Spring inyecta automáticamente el servicio
    @Autowired
    private TrabajadorService trabajadorService;

    // GET /api/trabajadores -> devuelve todos los trabajadores
    @GetMapping
    public List<Trabajador> obtenerTodos() {
        return trabajadorService.obtenerTodos();
    }

    // GET /api/trabajadores/{id} -> devuelve un trabajador por su id
    @GetMapping("/{id}")
    public ResponseEntity<Trabajador> obtenerPorId(@PathVariable Long id) {
        return trabajadorService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/trabajadores -> crea un trabajador nuevo
    @PostMapping
    public Trabajador crear(@RequestBody Trabajador trabajador) {
        return trabajadorService.guardar(trabajador);
    }

    // PUT /api/trabajadores/{id} -> actualiza un trabajador existente
    @PutMapping("/{id}")
    public ResponseEntity<Trabajador> actualizar(@PathVariable Long id, @RequestBody Trabajador trabajador) {
        return trabajadorService.obtenerPorId(id)
                .map(t -> {
                    trabajador.setId(id);
                    return ResponseEntity.ok(trabajadorService.guardar(trabajador));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/trabajadores/{id} -> elimina un trabajador
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        trabajadorService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
