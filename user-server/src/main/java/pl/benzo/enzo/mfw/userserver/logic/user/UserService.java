package pl.benzo.enzo.mfw.userserver.logic.user;

import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import pl.benzo.enzo.mfw.userserver.data.entity.User;
import pl.benzo.enzo.mfw.userserver.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.data.mapper.UserMapper;
import pl.benzo.enzo.mfw.userserver.data.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public UserDTO createUser(@Valid UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);
        user.setClientAppId(userDTO.getRole().toString() + "-" + UUID.randomUUID() + "-" + userDTO.getCountry());
        User savedUser = userRepository.save(user);
        return userMapper.toPrivateDTO(savedUser);
    }

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findByIdAndDeprecateIsFalse(id)
                .map(userMapper::toPrivateDTO);
    }

    public User getUserByMail(String mail) {
        return userRepository.findByMailAndDeprecateIsFalse(mail)
                .orElseThrow(() -> new IllegalArgumentException(""));
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAllByDeprecateIsFalse()
                .stream()
                .map(userMapper::toPrivateDTO)
                .collect(Collectors.toList());
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        return userRepository.findById(id)
                .map(user -> {
                    if (userDTO.getPassword() != null) {
                        user.setPassword(userDTO.getPassword());
                    }
                    if (userDTO.getMail() != null) {
                        user.setMail(userDTO.getMail());
                    }
                    if (userDTO.getPoints() != null) {
                        user.setPoints(userDTO.getPoints());
                    }
                    if (userDTO.getRole() != null) {
                        user.setRole(userDTO.getRole());
                    }
                    if (userDTO.getLastLoggedAt() != null) {
                        user.setLastLoggedAt(userDTO.getLastLoggedAt());
                    }
                    User updatedUser = userRepository.save(user);
                    return userMapper.toPrivateDTO(updatedUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public void deprecateUser(Long id) {
        userRepository.findById(id)
                .ifPresent(user -> {
                    user.setDeprecate(true);
                    userRepository.save(user);
                });
    }
}
