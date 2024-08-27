package pl.benzo.enzo.mfw.userserver.domain.logic;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.AuthorizationDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.SignInDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.entity.User;
import pl.benzo.enzo.mfw.userserver.domain.data.enumeration.Role;
import pl.benzo.enzo.mfw.userserver.domain.data.mapper.UserMapper;
import pl.benzo.enzo.mfw.userserver.domain.logic.security.JwtHandler;
import pl.benzo.enzo.mfw.userserver.domain.logic.user.UserService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountManager {
    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserMapper userMapper;
    private final JwtHandler jwtHandler;

    public Optional<AuthorizationDTO> loggInToAccount(SignInDTO request){
        User user = userService.getUserByMail(request.mail());
        if(checkPassword(request.password() + request.mail(), user.getPassword())){
            Role role = user.getRole();
            String token = jwtHandler.generateToken(request.mail(), role);
            return Optional.of(new AuthorizationDTO(token,userMapper.toPrivateDTO(user)));
        }
        return Optional.empty();
    }

    private boolean checkPassword(String password, String encodedPassword) {
        return bCryptPasswordEncoder.matches(password, encodedPassword);
    }

    public UserDTO createUserAccount(@Valid UserDTO request){
        request.setPassword(bCryptPasswordEncoder.encode(request.getPassword() + request.getMail()));
        return userService.createUser(request);
    }
}
