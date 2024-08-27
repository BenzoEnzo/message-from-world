package pl.benzo.enzo.mfw.userserver.data.dto;

import jakarta.validation.constraints.Size;
import lombok.*;
import pl.benzo.enzo.mfw.userserver.data.enumeration.Role;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String clientAppId;
    @Size(min = 2, max = 2, message = "Country code must be exactly 2 characters")
    private String country;
    private String password;
    private String mail;
    private Integer points;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoggedAt;
    private boolean deprecate;
}
