package pl.benzo.enzo.mfw.messageserver.domain;

import io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient;
import io.confluent.kafka.schemaregistry.client.rest.exceptions.RestClientException;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static lombok.AccessLevel.PRIVATE;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class KafkaSyncMessagePublisher  {

    private final KafkaTemplate kafkaTemplate;

    public String getSchema(Map<String, Object> properties, String topic){
        CachedSchemaRegistryClient cachedSchemaRegistryClient = new CachedSchemaRegistryClient(properties.get("schema.registry.url").toString(),1, properties);
        try {
            return cachedSchemaRegistryClient.getLatestSchemaMetadata(topic + "-value").getSchema();
        }catch(IOException | RestClientException e){
            e.printStackTrace();
        }
        return null;
    }

    public void publish(final String topicName, final SpecificRecord message, final String key) {
        final var producerRecord = new ProducerRecord<>(topicName, key, message);
        try {
            final var sendResult = kafkaTemplate.send(producerRecord);
            kafkaTemplate.flush();
            sendResult.get();
            log.info("Send message");
        } catch (final InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Sending interrupted", e);
        } catch (final KafkaException | ExecutionException e) {
            log.error("There was error while synchronous send event to Kafka cluster", e);
        }
    }
}