package pl.benzo.enzo.mfw.messageserver.domain;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.avro.generic.GenericRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import pl.benzo.enzo.mfw.messageserver.MfwMessage;
import pl.benzo.enzo.mfw.messageserver.logic.MfwMessageConverter;


@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaSyncMessageConsumer {

    @KafkaListener(topics = "mfw_MESSAGES", groupId = "consumer55")
    public void consume(GenericRecord message) {
        try {
            MfwMessage mfwMessage = MfwMessageConverter.convertToMfwMessage(message);
            System.out.println(mfwMessage);
        } catch (Exception e) {
            log.error("Failed to process message", e);
        }
    }

}
