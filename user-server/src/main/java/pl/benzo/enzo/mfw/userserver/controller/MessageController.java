package pl.benzo.enzo.mfw.userserver.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.benzo.enzo.mfw.messageserver.MfwMessage;
import pl.benzo.enzo.mfw.messageserver.logic.KafkaRandomMessageService;
import pl.benzo.enzo.mfw.userserver.external.MessageService;
import pl.benzo.enzo.mfw.userserver.external.MfwMessageMapper;
import pl.benzo.enzo.mfw.userserver.external.data.MessageDTO;


@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;
    private final KafkaRandomMessageService kafkaRandomMessageService;

    @PostMapping("")
    public ResponseEntity<MessageDTO> sendMsg(@RequestBody MessageDTO request, HttpServletRequest httpRequest) {
        MessageDTO response = messageService.sendMessage(request, httpRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<MessageDTO> readRandomMessage(){
        MfwMessage randomMessage = kafkaRandomMessageService.getRandomMessage("mfw_MESSAGES");
        return new ResponseEntity<>(MfwMessageMapper.toMessageDTO(randomMessage), HttpStatus.OK);
    }
}
