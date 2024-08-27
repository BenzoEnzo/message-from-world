package pl.benzo.enzo.mfw.userserver.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.AuthorizationDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.SignInDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.domain.logic.AccountManager;

import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountManager accountManager;

    @PostMapping("/login")
    public ResponseEntity<AuthorizationDTO> login(@RequestBody SignInDTO request) {
        Optional<AuthorizationDTO> accountDTO = accountManager.loggInToAccount(request);
        return accountDTO.map(dto -> new ResponseEntity<>(dto, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.UNAUTHORIZED));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO request) {
        UserDTO response = accountManager.createUserAccount(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
