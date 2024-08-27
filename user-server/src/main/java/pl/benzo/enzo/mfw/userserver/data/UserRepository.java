package pl.benzo.enzo.mfw.userserver.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.benzo.enzo.mfw.userserver.data.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndDeprecateIsFalse(String username);
    List<User> findAllByDeprecateIsFalse();
    Optional<User> findByMailAndDeprecateIsFalse(String mail);
    Optional<User> findByIdAndDeprecateIsFalse(Long id);
    Optional<User> findByClientAppIdAndDeprecateIsFalse(String clientAppId);
}
