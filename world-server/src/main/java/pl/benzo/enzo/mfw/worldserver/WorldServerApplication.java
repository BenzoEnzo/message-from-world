package pl.benzo.enzo.mfw.worldserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"pl.benzo.enzo.mfw.messageserver"})
public class WorldServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorldServerApplication.class, args);
    }

}
