package com.controller;

import com.App;
import com.helper.SocketService;
import com.helper.Tuple2;
import com.model.Conversation;
import com.service.ConversationService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(App.service + "/conversation")
@RestController
public class ConversationController {

  @Autowired
  private ConversationService conversationService;

  @Autowired
  private SimpMessagingTemplate sender;
  
  private void podcastNewConversation(Conversation conversation, Tuple2<String, String> data) {
    this.sender.convertAndSend(
        String.format("%s/%s", SocketService.ChatSupplier.roomBrocker, conversation.getSenderId()),
        ResponseHandler.createdConversation(conversation.set_id(new ObjectId(data.get_1())))
      );

    this.sender.convertAndSend(
        String.format("%s/%s", SocketService.ChatSupplier.roomBrocker, conversation.getReceiverId()),
        ResponseHandler.createdConversation(conversation.reverse().set_id(new ObjectId(data.get_2())))
      );
  }

  private void podcastDeletedConversation(Conversation conversation) {
    this.sender.convertAndSend(
        String.format("%s/%s", SocketService.ChatSupplier.roomBrocker, conversation.getSenderId()),
        ResponseHandler.deletedConversation(conversation)
      );
  }

  @PostMapping("/add")
  public Response<Object> addConversation(@RequestBody Conversation conversation) {
    var res = this.conversationService.addConversation(conversation);

    if (res.isEmpty()) {
      return ResponseHandler.error(null);
    } else if (res.get().isEmpty()) {
      return ResponseHandler.createdConversation(null);
    } else {
      this.podcastNewConversation(conversation, res.get());
      return ResponseHandler.ok(res.get());
    }
  }

  @GetMapping("/get")
  public Response<Object> getConversation(
    @RequestParam(name = "senderid", required = true) String senderId,
    @RequestParam(name = "index", required = true) int index
  ) {
    var res = this.conversationService.getConversation(senderId, index);

    if (res.isEmpty()) {
      return ResponseHandler.error(null);
    } else {
      return ResponseHandler.ok(res.get());
    }
  }

  @PostMapping("/delete")
  public Response<Object> deleteConversation(@RequestBody Conversation conversation) {
    var res = this.conversationService.deleteConversation(conversation);

    if (res.isEmpty()) {
      return ResponseHandler.error(null);
    } else {
      podcastDeletedConversation(conversation);
      return ResponseHandler.ok(null);
    }
  }
}
