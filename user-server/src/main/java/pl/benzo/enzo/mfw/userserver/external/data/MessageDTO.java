package pl.benzo.enzo.mfw.userserver.external.data;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.external.data.dto.MetadataDTO;
import pl.benzo.enzo.mfw.userserver.external.data.dto.ReaderDTO;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Getter
@Setter
public class MessageDTO {
    private String messageId;
    private LocalDateTime sendAt;
    private String content;
    private UserDTO profile;
    private MetadataDTO metadata;
    private boolean isRead = false;
    private ReaderDTO reader = null;
}
