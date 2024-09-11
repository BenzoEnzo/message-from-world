package pl.benzo.enzo.mfw.userserver.external;

import pl.benzo.enzo.mfw.messageserver.MfwMessage;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.enumeration.Role;
import pl.benzo.enzo.mfw.userserver.external.data.MessageDTO;
import pl.benzo.enzo.mfw.userserver.external.data.dto.LifecycleEntryDTO;
import pl.benzo.enzo.mfw.userserver.external.data.dto.MetadataDTO;
import pl.benzo.enzo.mfw.userserver.external.data.dto.ReaderDTO;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class MfwMessageMapper {

    public static MessageDTO toMessageDTO(MfwMessage mfwMessage) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;


        UserDTO userDTO = new UserDTO();
        userDTO.setClientAppId(mfwMessage.getUser().getId().toString());
        userDTO.setUsername(mfwMessage.getUser().getUsername().toString());
        userDTO.setMail(mfwMessage.getUser().getEmail().toString());
        userDTO.setRole(Role.valueOf(mfwMessage.getUser().getRole().name()));


        MetadataDTO metadataDTO = new MetadataDTO(
                mfwMessage.getMetadata().getIpAddress().toString(),
                mfwMessage.getMetadata().getDevice().toString()
        );


        Set<LifecycleEntryDTO> lifecycleEntries = new HashSet<>();
        for (var lifecycleRecord : mfwMessage.getLifecycle()) {
            ReaderDTO readerDTO = null;
            if (lifecycleRecord.getReader() != null) {
                readerDTO = new ReaderDTO(
                        lifecycleRecord.getReader().getId().toString(),
                        lifecycleRecord.getReader().getUsername().toString(),
                        lifecycleRecord.getReader().getReadTimestamp() != null
                                ? LocalDateTime.parse(lifecycleRecord.getReader().getReadTimestamp(), formatter)
                                : null
                );
            }

            LifecycleEntryDTO lifecycleEntryDTO = new LifecycleEntryDTO();
            lifecycleEntryDTO.setRead(lifecycleRecord.getIsRead());
            lifecycleEntryDTO.setReader(readerDTO);
            lifecycleEntries.add(lifecycleEntryDTO);
        }


        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setMessageId(mfwMessage.getMessageId().toString());
        messageDTO.setSendAt(LocalDateTime.parse(mfwMessage.getTimestamp(), formatter));
        messageDTO.setContent(mfwMessage.getContent().toString());
        messageDTO.setProfile(userDTO);
        messageDTO.setMetadata(metadataDTO);
        messageDTO.setLifecycleEntries(lifecycleEntries);

        return messageDTO;
    }
}

