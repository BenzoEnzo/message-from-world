package pl.benzo.enzo.mfw.userserver.domain.data.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDTO(User user);

    User toEntity(UserDTO userDTO);

    @Mapping(target = "password", constant = "********")
    UserDTO toPrivateDTO(User user);

}
