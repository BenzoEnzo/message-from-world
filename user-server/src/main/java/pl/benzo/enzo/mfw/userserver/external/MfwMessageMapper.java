package pl.benzo.enzo.mfw.userserver.external;

import pl.benzo.enzo.mfw.messageserver.MfwMessage;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.enumeration.Role;
import pl.benzo.enzo.mfw.userserver.external.data.MessageDTO;
import pl.benzo.enzo.mfw.userserver.external.data.dto.MetadataDTO;
import pl.benzo.enzo.mfw.userserver.external.data.dto.ReaderDTO;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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


        ReaderDTO readerDTO = null;
        if (mfwMessage.getLifecycle().getReader() != null) {
            readerDTO = new ReaderDTO(
                    mfwMessage.getLifecycle().getReader().getId().toString(),
                    mfwMessage.getLifecycle().getReader().getUsername().toString(),
                    mfwMessage.getLifecycle().getReader().getReadTimestamp() != null
                            ? LocalDateTime.parse(mfwMessage.getLifecycle().getReader().getReadTimestamp(), formatter)
                            : null
            );
        }

        boolean isRead = mfwMessage.getLifecycle().getIsRead();


        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setMessageId(mfwMessage.getMessageId().toString());
        messageDTO.setSendAt(LocalDateTime.parse(mfwMessage.getTimestamp(), formatter));
        messageDTO.setContent(mfwMessage.getContent().toString());
        messageDTO.setProfile(userDTO);
        messageDTO.setMetadata(metadataDTO);
        messageDTO.setRead(isRead);
        messageDTO.setReader(readerDTO);

        return messageDTO;
    }
}

