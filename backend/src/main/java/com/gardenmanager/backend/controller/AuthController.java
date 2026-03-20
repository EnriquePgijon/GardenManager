package com.gardenmanager.backend.controller;

import com.gardenmanager.backend.model.Usuario;
import com.gardenmanager.backend.Repository.UsuarioRepository;
import com.gardenmanager.backend.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// Controlador que gestiona el registro e inicio de sesión de usuarios
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // POST /api/auth/login -> inicia sesión y devuelve un token JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        credenciales.get("username"),
                        credenciales.get("password")
                )
        );
        String token = jwtUtil.generarToken(credenciales.get("username"));
        return ResponseEntity.ok(Map.of("token", token));
    }

    // POST /api/auth/registro -> registra un nuevo usuario en el sistema
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya existe");
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuario registrado correctamente");
    }
}