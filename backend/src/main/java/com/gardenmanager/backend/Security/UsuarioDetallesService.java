package com.gardenmanager.backend.Security;

import com.gardenmanager.backend.model.Usuario;
import com.gardenmanager.backend.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

// Servicio que carga los datos del usuario para Spring Security
@Service
public class UsuarioDetallesService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Busca un usuario por su nombre de usuario y lo devuelve en el formato que Spring Security entiende
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        return new User(
                usuario.getUsername(),
                usuario.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol()))
        );
    }
}