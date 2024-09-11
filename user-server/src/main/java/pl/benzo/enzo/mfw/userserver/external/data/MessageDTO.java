package pl.benzo.enzo.mfw.userserver.external.data;

import lombok.Data;
import lombok.NoArgsConstructor;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.external.data.dto.LifecycleEntryDTO;
import pl.benzo.enzo.mfw.userserver.external.data.dto.MetadataDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
public class MessageDTO {
    private String messageId;
    private LocalDateTime sendAt;
    private String content;
    private UserDTO profile;
    private MetadataDTO metadata;
    private Set<LifecycleEntryDTO> lifecycleEntries;
}
