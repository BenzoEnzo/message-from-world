package pl.benzo.enzo.mfw.messageserver.configuration;

import io.confluent.kafka.serializers.KafkaAvroDeserializer;
import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.avro.generic.GenericRecord;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import pl.benzo.enzo.mfw.messageserver.MfwMessage;

import java.util.HashMap;
import java.util.Map;

import static lombok.AccessLevel.PRIVATE;

@Slf4j
@EnableKafka
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
class KafkaConsumerConfiguration {

    static final String SCHEMA_REGISTRY_URL_KEY = "schema.registry.url";
    private final KafkaConfiguration kafkaConfiguration;

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, SpecificRecord> kafkaListenerContainerFactory() {
        var factory = new ConcurrentKafkaListenerContainerFactory<String, SpecificRecord>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, SpecificRecord> consumerFactory() {
        final var consumerConfig = getConsumerConfig();
        return new DefaultKafkaConsumerFactory<>(consumerConfig);
    }

    private Map<String, Object> getConsumerConfig() {
        final Map<String, Object> properties = new HashMap<>();
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaConfiguration.getBootstrapServers());
        properties.put(ConsumerConfig.RECONNECT_BACKOFF_MS_CONFIG, "5000");
        properties.put(ConsumerConfig.RETRY_BACKOFF_MS_CONFIG, "5000");
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer.class.getName());
        properties.put(SCHEMA_REGISTRY_URL_KEY, kafkaConfiguration.getSchemaRegistryUrl());
        properties.put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, "false");
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "consumer55");

        return properties;
    }
}

