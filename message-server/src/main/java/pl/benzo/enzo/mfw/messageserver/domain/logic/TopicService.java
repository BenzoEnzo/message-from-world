package pl.benzo.enzo.mfw.messageserver.domain.logic;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.stereotype.Service;
import pl.benzo.enzo.mfw.messageserver.domain.abstraction.Topic;

import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class TopicService implements Topic {
    private final AdminClient adminClient;

    @Override
    public NewTopic create(String name) {
        try {
            if(!adminClient.listTopics().names().get().contains(name)){
                return new NewTopic(name,1,(short) 1);
            }
        }catch (ExecutionException | InterruptedException e){
            e.printStackTrace();
        }
        return null;
    }
}
