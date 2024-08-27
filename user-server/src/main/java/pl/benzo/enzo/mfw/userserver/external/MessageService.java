package pl.benzo.enzo.mfw.userserver.external;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.benzo.enzo.mfw.messageserver.Metadata;
import pl.benzo.enzo.mfw.messageserver.MfwMessage;
import pl.benzo.enzo.mfw.messageserver.Role;
import pl.benzo.enzo.mfw.messageserver.User;
import pl.benzo.enzo.mfw.messageserver.domain.KafkaSyncMessagePublisher;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.mapper.UserMapper;
import pl.benzo.enzo.mfw.userserver.domain.logic.user.UserService;
import pl.benzo.enzo.mfw.userserver.external.data.MessageDTO;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final KafkaSyncMessagePublisher kafkaSyncMessagePublisher;
    private final UserService userService;
    private final UserMapper userMapper;

    public MessageDTO sendMessage(MessageDTO message){
        MfwMessage mfwMessage = createKafkaMsgObject(message);
        kafkaSyncMessagePublisher.publish("mfw_MESSAGES",mfwMessage,message.getKey());
        message.setProfile(afterSendMsgToWorld(message));
        return message;
    }

    private UserDTO afterSendMsgToWorld(MessageDTO message){
        UserDTO userDTO = message.getProfile();
        pl.benzo.enzo.mfw.userserver.domain.data.entity.User user = userService.getUserByMail(userDTO.getMail());
        int points = user.getPoints() + 1;
        user.setPoints(points);
        return userService.updateUser(user.getId(), userMapper.toDTO(user));
    }

    private MfwMessage createKafkaMsgObject(MessageDTO message){
        LocalDateTime now = LocalDateTime.now();

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        CharSequence formattedTimestamp = now.format(formatter);

        User user = User.newBuilder()
                .setId(message.getProfile().getClientAppId())
                .setUsername(message.getProfile().getUsername())
                .setEmail(message.getProfile().getMail())
                .setRole(Role.valueOf(message.getProfile().getRole().name()))
                .build();

        Metadata metadata = Metadata.newBuilder()
                .setIpAddress(message.getMetadata().ipAddress())
                .setDevice(message.getMetadata().deviceName())
                .build();

        return MfwMessage.newBuilder()
                .setMessageId(message.getKey())
                .setUser(user)
                .setContent(message.getContent())
                .setTimestamp(formattedTimestamp)
                .setMetadata(metadata)
                .build();

    }
}
