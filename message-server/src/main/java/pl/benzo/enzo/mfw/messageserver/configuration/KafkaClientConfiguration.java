package pl.benzo.enzo.mfw.messageserver.configuration;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
public class KafkaClientConfiguration {
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.admin.client-id}")
    private String adminClientId;

    @Value("${spring.kafka.security.protocol}")
    private String securityProtocol;


    @Bean
    public AdminClient adminClient(){
        Properties properties = new Properties();

        properties.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.put(AdminClientConfig.SECURITY_PROTOCOL_CONFIG, securityProtocol);
        properties.put(AdminClientConfig.CLIENT_ID_CONFIG, adminClientId);

        return AdminClient.create(properties);
    }
}
