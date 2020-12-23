package entity

import "gopkg.in/mgo.v2/bson"

type ProfileEntity struct {
	ID        bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	AccountID bson.ObjectId `json:"accountID,omitempty" bson:"accountID,omitempty"`
	Avatar    string        `json:"avatar,omitempty" bson:"avatar,omitempty"`
	Surname   string        `json:"surname,omitempty" bson:"surname,omitempty"`
	Name      string        `json:"name,omitempty" bson:"name,omitempty"`
	Username  string        `json:"username,omitempty" bson:"username,omitempty"`
	Tel       string        `json:"tel,omitempty" bson:"tel,omitempty"`
	Sex       string        `json:"sex,omitempty" bson:"sex,omitempty"`
}
