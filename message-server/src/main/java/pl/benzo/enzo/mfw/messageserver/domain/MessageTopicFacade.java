package pl.benzo.enzo.mfw.messageserver.domain;


import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.AdminClient;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import pl.benzo.enzo.mfw.messageserver.UserMessage;
import pl.benzo.enzo.mfw.messageserver.domain.logic.TopicService;

@Service
@RequiredArgsConstructor
public class MessageTopicFacade {
    private final AdminClient adminClient;
    private final TopicService topicService;
    private final KafkaTemplate<String, UserMessage> kafkaTemplate;

    @Bean
    public void createOnInit(){
        topicService.create("MESSAGE_TOPIC");
    }
}
