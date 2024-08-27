package pl.benzo.enzo.mfw.userserver.data.dto;

public record AuthorizationDTO(String jwtToken, UserDTO profile) { }
