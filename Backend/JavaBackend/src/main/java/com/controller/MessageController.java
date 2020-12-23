package com.controller;

import com.App;
import com.helper.SocketService;
import com.model.Conversation;
import com.model.Message;
import com.service.MessageService;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(App.service + "/message")
@RestController
public class MessageController {

  @Autowired
  private MessageService messageService;

  @Autowired
  private SimpMessagingTemplate simpMessagingTemplate;

  private void sendToUser(String userId, Object message) {
    this.simpMessagingTemplate.convertAndSend(
        String.format("%s/%s", SocketService.ChatSupplier.messageBrocker, userId),
        ResponseHandler.ok(message)
      );
  }

  @MessageMapping(SocketService.ChatSupplier.chatHanlder)
  public void messageHandle(@Payload Message message) {
    Optional<Optional<String>> res = this.messageService.addMessage(message);
    
    if (res.isEmpty()) {
      sendToUser(
        message.getSenderId(),
        ResponseHandler.error(null)
      );
    } else if (res.get().isEmpty()) {
      sendToUser(
        message.getSenderId(),
        ResponseHandler.conversationNotExisted(null)
      );
    } else {
      message.set_id(new ObjectId(res.get().get()));
      sendToUser(message.getSenderId(), message);
      sendToUser(message.getReceiverId(), message);
    }
  }

  @GetMapping("/get")
  public Response<Object> getMessage(
    @RequestParam(name = "senderid", required = true) String senderId,
    @RequestParam(name = "receiverid", required = true) String receiverId,
    @RequestParam(name = "index", required = true) int index
  ) {
    var res = this.messageService.getMessage(new Conversation(senderId, receiverId), index);

    if (res.isEmpty()) {
      return ResponseHandler.error(null);
    } else {
      return ResponseHandler.ok(res.get());
    }
  }
}
