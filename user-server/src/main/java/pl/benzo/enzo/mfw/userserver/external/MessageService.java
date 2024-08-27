package pl.benzo.enzo.mfw.userserver.external;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.benzo.enzo.mfw.messageserver.*;
import pl.benzo.enzo.mfw.messageserver.domain.KafkaSyncMessagePublisher;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.mapper.UserMapper;
import pl.benzo.enzo.mfw.userserver.domain.logic.security.JwtHandler;
import pl.benzo.enzo.mfw.userserver.domain.logic.user.UserService;
import pl.benzo.enzo.mfw.userserver.external.data.MessageDTO;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final KafkaSyncMessagePublisher kafkaSyncMessagePublisher;
    private final JwtHandler jwtHandler;
    private final UserService userService;
    private final UserMapper userMapper;

    public MessageDTO sendMessage(MessageDTO message, HttpServletRequest request){
        UserDTO profile = handleAuthorization(request);
        message.setProfile(profile);
        Map<String,String> idValsMap = transformDataValue(profile.getUsername(), profile.getClientAppId());
        message.setMessageId(idValsMap.get("messageId"));
        MfwMessage mfwMessage = createKafkaMsgObject(message);
        kafkaSyncMessagePublisher.publish("mfw_MESSAGES",mfwMessage,message.getMessageId());
        message.setProfile(afterSendMsgToWorld(message));
        return message;
    }

    private UserDTO handleAuthorization(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String mail = jwtHandler.extractUsername(token);
            return userMapper.toPrivateDTO(userService.getUserByMail(mail));
        }
        throw new RuntimeException("Unauthorized");
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

        if (message.isRead()) {
            Reader reader = Reader.newBuilder()
                    .setId(message.getReader().id())
                    .setUsername(message.getReader().userName())
                    .setReadTimestamp(message.getReader().readTimestamp().format(formatter))
                    .build();

            Lifecycle lifecycle = Lifecycle.newBuilder()
                    .setIsRead(true)
                    .setReader(reader)
                    .build();

            return MfwMessage.newBuilder()
                    .setMessageId(message.getMessageId())
                    .setUser(user)
                    .setContent(message.getContent())
                    .setTimestamp(formattedTimestamp)
                    .setMetadata(metadata)
                    .setLifecycle(lifecycle)
                    .build();

        } else {
            Lifecycle lifecycle = Lifecycle.newBuilder()
                    .setIsRead(false)
                    .setReader(null)
                    .build();


        return MfwMessage.newBuilder()
                .setMessageId(message.getMessageId())
                .setUser(user)
                .setContent(message.getContent())
                .setTimestamp(formattedTimestamp)
                .setMetadata(metadata)
                .setLifecycle(lifecycle)
                .build();

    }
        }

    public Map<String,String> transformDataValue(String username, String clientAppId) {
        for (int i = 0; i < 10000; i++) {
            String uniqueElement = Instant.now().toString() + ":" + i;
            String combinedString = username + ":" + clientAppId + ":" + uniqueElement;
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] hash = digest.digest(combinedString.getBytes(StandardCharsets.UTF_8));

                String base64Hash = Base64.getEncoder().encodeToString(hash);

                String key = "message-" + base64Hash.substring(0, base64Hash.length() / 2);
                String messageId = "messageId-" + base64Hash.substring(base64Hash.length() / 2);
                Map<String, String> hashM = new HashMap<>();

                hashM.put("key",key);
                hashM.put("messageId", messageId);

                return hashM;

            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
        }
        return null;
    }
}
