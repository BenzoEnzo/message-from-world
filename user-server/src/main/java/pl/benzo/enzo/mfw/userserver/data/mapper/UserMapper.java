package pl.benzo.enzo.mfw.userserver.data.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import pl.benzo.enzo.mfw.userserver.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.data.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDTO(User user);

    User toEntity(UserDTO userDTO);

    @Mapping(target = "password", constant = "********")
    UserDTO toPrivateDTO(User user);

}
