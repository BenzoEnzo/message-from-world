package pl.benzo.enzo.mfw.userserver.logic.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import pl.benzo.enzo.mfw.userserver.data.enumeration.Role;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class RequestAuthenticator extends OncePerRequestFilter {
    private final static Logger LOGGER = LoggerFactory.getLogger(RequestAuthenticator.class);
    private final JwtHandler jwtHandler;

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        String token = null;
        String mail = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            mail = jwtHandler.extractUsername(token);
        }

        if (mail != null && jwtHandler.validateToken(token, mail)) {
            String role = jwtHandler.extractRole(token);
            GrantedAuthority authority = convertRolesToAuthorities(role);
            Authentication authToken = new UsernamePasswordAuthenticationToken(authority, mail, Collections.singletonList(authority));
            LOGGER.info("Account mail: {}", mail);
            LOGGER.info("Account privilege: {}", role);

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }

    private static GrantedAuthority convertRolesToAuthorities(String role) {
        return new SimpleGrantedAuthority("ROLE_" + role);

    }
}
