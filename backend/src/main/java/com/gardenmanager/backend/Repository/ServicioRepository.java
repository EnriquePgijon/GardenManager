package com.gardenmanager.backend.Repository;

import com.gardenmanager.backend.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// Repositorio para acceder a los datos de los servicios en la base de datos
@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    // Busca todos los servicios de un cliente concreto por su id
    List<Servicio> findByClienteId(Long clienteId);

    // Busca todos los servicios por su estado (PENDIENTE, EN_PROCESO, FINALIZADO)
    List<Servicio> findByEstado(String estado);
}