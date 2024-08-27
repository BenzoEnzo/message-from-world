package pl.benzo.enzo.mfw.userserver.external;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.benzo.enzo.mfw.messageserver.*;
import pl.benzo.enzo.mfw.messageserver.domain.KafkaSyncMessagePublisher;
import pl.benzo.enzo.mfw.messageserver.logic.KafkaRandomMessageService;
import pl.benzo.enzo.mfw.userserver.domain.data.dto.UserDTO;
import pl.benzo.enzo.mfw.userserver.domain.data.mapper.UserMapper;
import pl.benzo.enzo.mfw.userserver.domain.logic.security.JwtHandler;
import pl.benzo.enzo.mfw.userserver.domain.logic.user.UserService;
import pl.benzo.enzo.mfw.userserver.external.data.MessageDTO;
import pl.benzo.enzo.mfw.userserver.external.data.dto.ReaderDTO;

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
@Slf4j
public class MessageService {
    private static final Logger LOGGER = LoggerFactory.getLogger("[MESSAGES]");
    private final KafkaSyncMessagePublisher kafkaSyncMessagePublisher;
    private final KafkaRandomMessageService kafkaRandomMessageService;
    private final JwtHandler jwtHandler;
    private final UserService userService;
    private final UserMapper userMapper;

    public MessageDTO sendMessage(MessageDTO message, HttpServletRequest request){
        UserDTO profile = handleAuthorization(request);
        message.setProfile(profile);
        Map<String,String> idValsMap = transformDataValue(profile.getUsername(), profile.getClientAppId());
        message.setMessageId(idValsMap.get("messageId"));
        MfwMessage mfwMessage = createKafkaMsgObject(message);
        LOGGER.info(mfwMessage.toString());
        LOGGER.info(mfwMessage.getMessageId().toString());
        kafkaSyncMessagePublisher.publish("mfw_MESSAGES",mfwMessage, message.getMessageId());
        message.setProfile(afterSendMsgToWorld(message));
        return message;
    }

    public MessageDTO getRandomAndUpdateMessage(HttpServletRequest request){
        UserDTO profile = handleAuthorization(request);
        MfwMessage randomMessage = kafkaRandomMessageService.getRandomMessage("mfw_MESSAGES");
        MessageDTO msgDTO = MfwMessageMapper.toMessageDTO(randomMessage);
        if(msgDTO.getProfile().getMail().equals(profile.getMail())){
            getRandomAndUpdateMessage(request);
        } else {
            msgDTO.setRead(true);
            ReaderDTO reader = new ReaderDTO(profile.getClientAppId(), profile.getUsername(), LocalDateTime.now());
            msgDTO.setReader(reader);
            MfwMessage mfwMessage = createKafkaMsgObject(msgDTO);
            kafkaSyncMessagePublisher.publish("mfw_MESSAGES", mfwMessage, msgDTO.getMessageId());
        }
        return msgDTO;
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

    public Map<String, String> transformDataValue(String username, String clientAppId) {
        for (int i = 0; i < 10000; i++) {
            String uniqueElement = Instant.now().toString() + ":" + i;
            String combinedString = username + ":" + clientAppId + ":" + uniqueElement;
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] hash = digest.digest(combinedString.getBytes(StandardCharsets.UTF_8));

                String base64Hash = Base64.getEncoder().encodeToString(hash);

                String sanitizedHash = base64Hash.replaceAll("[^a-zA-Z0-9]", "");

                String key = "message-" + sanitizedHash.substring(0, sanitizedHash.length() / 2);
                String messageId = "messageId-" + sanitizedHash.substring(sanitizedHash.length() / 2);
                Map<String, String> hashM = new HashMap<>();

                hashM.put("key", key);
                hashM.put("messageId", messageId);

                return hashM;

            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
        }
        return null;
    }
}
