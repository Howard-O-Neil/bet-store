package com.controller;

public class ResponseHandler {

  public static Response<Object> ok(Object data) {
    return new Response<Object>(200, "ok", data);
  }

  public static Response<Object> error(Object data) {
    return new Response<Object>(500, "internal-server-error", data);
  }

  public static Response<Object> duplicateConversation(Object data) {
    return new Response<Object>(1001, "duplicate-conversation", data);
  }

  public static Response<Object> deletedConversation(Object data) {
    return new Response<Object>(1002, "deleted-conversation", data);
  }

  public static Response<Object> createdConversation(Object data) {
    return new Response<Object>(1003, "created-conversation", data);
  }

  public static Response<Object> conversationNotExisted(Object data) {
    return new Response<Object>(1004, "conversation-not-existed", data);
  }
}
