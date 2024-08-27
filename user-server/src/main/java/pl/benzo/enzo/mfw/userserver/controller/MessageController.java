package pl.benzo.enzo.mfw.userserver.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.benzo.enzo.mfw.userserver.external.MessageService;
import pl.benzo.enzo.mfw.userserver.external.data.MessageDTO;


@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @PostMapping("")
    public ResponseEntity<MessageDTO> sendMsg(@RequestBody MessageDTO request) {
        MessageDTO response = messageService.sendMessage(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
