package com.network;

import com.helper.SocketService;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.setApplicationDestinationPrefixes(
      SocketService.ChatSupplier.appPrefix,
      SocketService.NotificationSupplier.appPrefix
    );

    registry.enableSimpleBroker(
      SocketService.ChatSupplier.messageBrocker,
      SocketService.ChatSupplier.roomBrocker,
      SocketService.NotificationSupplier.notificationBrocker,
      "/testChannel"
    );
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry
      .addEndpoint(
        SocketService.ChatSupplier.socketPrefix,
        SocketService.NotificationSupplier.socketPrefix
      )
      .setAllowedOrigins("*")
      .withSockJS();
  }
}
