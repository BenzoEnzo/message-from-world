package pl.benzo.enzo.mfw.messageserver.configuration;

import lombok.*;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "schema")
@Getter
@AllArgsConstructor
@RequiredArgsConstructor
@Setter
public class SchemaConfiguration {
    private String messageSchema;
}

