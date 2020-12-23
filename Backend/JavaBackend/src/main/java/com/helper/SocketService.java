package com.helper;

public class SocketService {

  public class ChatSupplier {
    public static final String socketPrefix = "/chat-socket";
    public static final String appPrefix = "/chat";

    public static final String chatHanlder = "/handle";

    public static final String messageBrocker = appPrefix + "/message";
    public static final String roomBrocker = appPrefix + "/room";
  }

  public class NotificationSupplier {
    public static final String socketPrefix = "/notification-socket";
    public static final String appPrefix = "/notification";

    public static final String notificationBrocker = appPrefix + "/message";
  }
}
