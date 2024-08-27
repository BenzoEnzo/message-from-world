package pl.benzo.enzo.mfw.messageserver.logic;

import lombok.RequiredArgsConstructor;
import org.apache.avro.generic.GenericRecord;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.TopicPartition;
import org.springframework.stereotype.Service;
import pl.benzo.enzo.mfw.messageserver.MfwMessage;


import java.time.Duration;
import java.util.Collections;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class KafkaRandomMessageService {

    private final KafkaMetadataService kafkaMetadataService;
    private final KafkaConsumer<String, Object> kafkaConsumer;

    public MfwMessage getRandomMessage(String topic) {
        Map<TopicPartition, Long> offsets = kafkaMetadataService.getOffsetsForTopic(topic);

        Random random = new Random();
        TopicPartition randomPartition = offsets.keySet().stream()
                .skip(random.nextInt(offsets.size()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Failed to pick a random partition"));

        long startOffset = 0;
        long endOffset = offsets.get(randomPartition);
        long randomOffset = startOffset + (long) (random.nextDouble() * (endOffset - startOffset));

        kafkaConsumer.assign(Collections.singletonList(randomPartition));
        kafkaConsumer.seek(randomPartition, randomOffset);

        ConsumerRecord<String, Object> record = kafkaConsumer.poll(Duration.ofMillis(1000)).iterator().next();
        return MfwMessageConverter.convertToMfwMessage((GenericRecord) record.value());
    }
}
