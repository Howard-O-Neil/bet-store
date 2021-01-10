package com.model;

public class Profile extends MongoIdModel {
  private String avatar;
  private String surname;
  private String name;

  public Profile() {

  }

  public Profile(String avatar, String surname, String name, String username) {
    this.avatar = avatar;
    this.surname = surname;
    this.name = name;
    this.username = username;
  }

  public String getAvatar() {
    return this.avatar;
  }

  public void setAvatar(String avatar) {
    this.avatar = avatar;
  }

  public String getSurname() {
    return this.surname;
  }

  public void setSurname(String surname) {
    this.surname = surname;
  }

  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public Profile avatar(String avatar) {
    this.avatar = avatar;
    return this;
  }

  public Profile surname(String surname) {
    this.surname = surname;
    return this;
  }

  public Profile name(String name) {
    this.name = name;
    return this;
  }

  public Profile username(String username) {
    this.username = username;
    return this;
  }

  @Override
  public String toString() {
    return "{" +
      " avatar='" + getAvatar() + "'" +
      ", surname='" + getSurname() + "'" +
      ", name='" + getName() + "'" +
      ", username='" + getUsername() + "'" +
      "}";
  }
  private String username;


}
