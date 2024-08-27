package pl.benzo.enzo.mfw.userserver.domain.data.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.benzo.enzo.mfw.userserver.domain.data.enumeration.Role;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"username"}),
        @UniqueConstraint(columnNames = {"mail"}),
        @UniqueConstraint(columnNames = {"clientAppId"})
})
@NoArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String clientAppId;

    @Column(nullable = false)
    @Size(min = 2, max = 2)
    private String country;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String mail;

    @Column(nullable = false)
    private Integer points;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastLoggedAt;

    @Column(nullable = false)
    private boolean deprecate = false;
}