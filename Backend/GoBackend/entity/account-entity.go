package entity

import "gopkg.in/mgo.v2/bson"

type AccountEntity struct {
	ID       bson.ObjectId `json:"_id" bson:"_id"`
	Username string        `json:"username" bson:"username"`
	Password string        `json:"password" bson:"password"`
	Tel      string        `json:"tel" bson:"tel"`
	Keycode  string        `json:"key,omitempty" bson:"key,omitempty"`
	Profile  ProfileEntity `json:"profile" bson:"profile"`
}
