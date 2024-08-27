package pl.benzo.enzo.mfw.userserver.domain.data.dto;

public record AuthorizationDTO(String jwtToken, UserDTO profile) { }
