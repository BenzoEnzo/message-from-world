package pl.benzo.enzo.mfw.messageserver.domain.abstraction;

import org.apache.kafka.clients.admin.NewTopic;

public interface Topic {
    NewTopic create(String name);
}
