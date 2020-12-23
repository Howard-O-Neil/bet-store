package entity

import "gopkg.in/mgo.v2/bson"

type SliderEntity struct {
	ID   bson.ObjectId `json:"_id" bson:"_id"`
	Link string        `json:"link" bson:"link"`
	Alt  string        `json:"alt" bson:"alt"`
	Href string        `json:"href" bson:"href"`
}
