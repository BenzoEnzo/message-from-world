package pl.benzo.enzo.mfw.userserver.external.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LifecycleEntryDTO {
    private boolean isRead;
    private ReaderDTO reader;
}
