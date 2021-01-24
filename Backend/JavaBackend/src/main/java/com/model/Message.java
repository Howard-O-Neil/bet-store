package com.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.bson.types.ObjectId;

public class Message extends MongoIdModel {
  private String senderId;
  private String receiverId;
  private String textContent;
  private Object fileContent;
  private String fileContentType;

  @JsonIgnore
  private MessageContentType setFileContentType;

  public Message() {}

  public Message(
    String senderId,
    String receiverId,
    String textContent,
    Object fileContent,
    MessageContentType contentType
  )
    throws Exception {
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.textContent = textContent;
    this.fileContent = fileContent;
    this.fileContentType = contentType.toString();
  }

  public Message(
    String senderId,
    String receiverId,
    String textContent,
    Object fileContent,
    String fileContentType
  ) {
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.textContent = textContent;
    this.fileContent = fileContent;
    this.fileContentType = fileContentType;
  }

  public String getSenderId() {
    return this.senderId;
  }

  public void setSenderId(String senderId) {
    this.senderId = senderId;
  }

  public String getReceiverId() {
    return this.receiverId;
  }

  public void setReceiverId(String receiverId) {
    this.receiverId = receiverId;
  }

  public String getTextContent() {
    return this.textContent;
  }

  public void setTextContent(String textContent) {
    this.textContent = textContent;
  }

  public Object getFileContent() {
    return this.fileContent;
  }

  public void setFileContent(Object fileContent) {
    this.fileContent = fileContent;
  }

  public String getFileContentType() {
    return this.fileContentType;
  }

  public void setFileContentType(String fileContentType) {
    this.fileContentType = fileContentType;
  }

  public void setContentType(MessageContentType contentType) {
    this.fileContentType = contentType.toString();
  }

  @Override
  public String toString() {
    return (
      "{" +
      " _id='" +
      get_id() +
      "'" +
      " senderId='" +
      getSenderId() +
      "'" +
      ", receiverId='" +
      getReceiverId() +
      "'" +
      ", textContent='" +
      getTextContent() +
      "'" +
      ", fileContent='" +
      getFileContent() +
      "'" +
      ", fileContentType='" +
      getFileContentType() +
      "'" +
      "}"
    );
  }
}
