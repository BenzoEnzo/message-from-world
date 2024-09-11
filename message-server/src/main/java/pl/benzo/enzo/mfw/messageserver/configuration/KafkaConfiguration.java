package pl.benzo.enzo.mfw.messageserver.configuration;


import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import static lombok.AccessLevel.PRIVATE;

@FieldDefaults(level = PRIVATE)
@Configuration
@Getter
@Setter
public class KafkaConfiguration {

    @Value("${spring.kafka.producer.bootstrap-servers}")
    String bootstrapServers;

    @Value("${spring.kafka.topic.name}")
    String topicName;

    @Value("${spring.kafka.schema.registry.url}")
    String schemaRegistryUrl;

    @Value("${spring.kafka.consumer.group-id}")
    String springGroupId;
}
