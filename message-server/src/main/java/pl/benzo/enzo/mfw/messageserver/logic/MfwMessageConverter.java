package pl.benzo.enzo.mfw.messageserver.logic;

import org.apache.avro.generic.GenericRecord;
import pl.benzo.enzo.mfw.messageserver.*;

import java.util.ArrayList;
import java.util.List;

public class MfwMessageConverter {

    public static MfwMessage convertToMfwMessage(GenericRecord genericRecord) {


        GenericRecord userRecord = (GenericRecord) genericRecord.get("user");

        User user = User.newBuilder()
                .setId(userRecord.get("id").toString())
                .setUsername(userRecord.get("username").toString())
                .setEmail(userRecord.get("email").toString())
                .setRole(Role.valueOf(userRecord.get("role").toString()))
                .build();


        GenericRecord metadataRecord = (GenericRecord) genericRecord.get("metadata");

        Metadata metadata = Metadata.newBuilder()
                .setIpAddress(metadataRecord.get("ipAddress").toString())
                .setDevice(metadataRecord.get("device").toString())
                .build();


        List<LifecycleEntry> lifecycleList = new ArrayList<>();
        List<GenericRecord> lifecycleRecords = (List<GenericRecord>) genericRecord.get("lifecycle");

        for (GenericRecord lifecycleRecord : lifecycleRecords) {

            Reader reader = null;
            if (lifecycleRecord.get("reader") != null) {
                GenericRecord readerRecord = (GenericRecord) lifecycleRecord.get("reader");
                reader = Reader.newBuilder()
                        .setId(readerRecord.get("id").toString())
                        .setUsername(readerRecord.get("username").toString())
                        .setReadTimestamp(readerRecord.get("readTimestamp") != null ? readerRecord.get("readTimestamp").toString() : null)
                        .build();
            }


            LifecycleEntry lifecycleEntry = LifecycleEntry.newBuilder()
                    .setIsRead((boolean) lifecycleRecord.get("isRead"))
                    .setReader(reader)
                    .build();

            lifecycleList.add(lifecycleEntry);
        }

        // Tworzenie obiektu MfwMessage z listą lifecycle
        return MfwMessage.newBuilder()
                .setMessageId(genericRecord.get("messageId").toString())
                .setUser(user)
                .setContent(genericRecord.get("content").toString())
                .setTimestamp(genericRecord.get("timestamp").toString())
                .setMetadata(metadata)
                .setLifecycle(lifecycleList)  // Ustawienie listy lifecycle
                .build();
    }
}
