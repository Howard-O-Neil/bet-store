package com.model;

public enum MessageContentType {
  CONTENT_NONE("CONTENT_NONE"),
  CONTENT_PRODUCT_INFO("CONTENT_PRODUCT_INFO"),
  CONTENT_SOUND("CONTENT_SOUND"),
  CONTENT_IMAGE("CONTENT_IMAGE"),
  CONTENT_PLAINTEXT("CONTENT_PLAINTEXT"),
  CONTENT_FILE("CONTENT_FILE");

  private String contentType;

  MessageContentType(String value) {
    this.contentType = value;
  }

  @Override
  public String toString() {
    return this.contentType;
  }
}
