package com.gardenmanager.backend.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

// Clase utilitaria para generar y validar tokens JWT
@Component
public class JwtUtil {

    // Clave secreta para firmar los tokens
    private static final String SECRET = "gardenmanager_clave_secreta_muy_larga_2024";

    // Tiempo de expiración del token: 24 horas
    private static final long EXPIRACION = 86400000;

    // Genera la clave de firma a partir del secreto
    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // Genera un token JWT para un usuario concreto
    public String generarToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRACION))
                .signWith(getKey())
                .compact();
    }

    // Extrae el nombre de usuario de un token
    public String obtenerUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Valida si un token es correcto y no ha expirado
    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}