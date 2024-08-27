package pl.benzo.enzo.mfw.messageserver.logic;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.TopicPartition;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KafkaMetadataService {

    private final KafkaConsumer<String, Object> kafkaConsumer;

    public Map<TopicPartition, Long> getOffsetsForTopic(String topic) {
        try {
            var topicPartitions = kafkaConsumer.partitionsFor(topic).stream()
                    .map(info -> new TopicPartition(info.topic(), info.partition()))
                    .toList();

            Map<TopicPartition, Long> partitionOffsets = new HashMap<>();
            for (TopicPartition tp : topicPartitions) {
                long endOffset = kafkaConsumer.endOffsets(topicPartitions).get(tp);
                partitionOffsets.put(tp, endOffset);
            }

            return partitionOffsets;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get offsets for topic: " + topic, e);
        }
    }
}
