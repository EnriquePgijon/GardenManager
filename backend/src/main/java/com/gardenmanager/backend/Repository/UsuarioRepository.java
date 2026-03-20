package com.gardenmanager.backend.Repository;

import com.gardenmanager.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// Repositorio para acceder a los datos de los usuarios en la base de datos
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca un usuario por su nombre de usuario
    Optional<Usuario> findByUsername(String username);
}