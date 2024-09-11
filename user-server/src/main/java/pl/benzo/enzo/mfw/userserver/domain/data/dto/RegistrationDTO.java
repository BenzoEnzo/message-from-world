package pl.benzo.enzo.mfw.userserver.domain.data.dto;

public record RegistrationDTO(String username, String mail, String password, String countryCode, String deviceId) {
}
