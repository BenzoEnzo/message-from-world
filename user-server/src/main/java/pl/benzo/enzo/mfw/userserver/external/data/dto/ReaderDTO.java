package pl.benzo.enzo.mfw.userserver.external.data.dto;

import java.time.LocalDateTime;

public record ReaderDTO(String id, String userName, LocalDateTime readTimestamp) {
}
