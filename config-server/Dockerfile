FROM openjdk:22

# Set the working directory in the container
WORKDIR /app

# Copy the application's jar file to the container
COPY target/config-server-0.0.1-SNAPSHOT.jar /app/MFW-config-server.jar

# Expose the port the application will run on
EXPOSE 8761

# Define environment variables
ENV SPRING_APPLICATION_NAME=MFW-config-server \
    SERVER_PORT=8761 \
    EUREKA_CLIENT_REGISTER_WITH_EUREKA=false \
    EUREKA_CLIENT_FETCH_REGISTRY=false \
    EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://discUser:discPassword@localhost:8761/eureka/ \
    EUREKA_SERVER_PEER_NODE_READ_TIMEOUT_MS=20000

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app/MFW-config-server.jar"]