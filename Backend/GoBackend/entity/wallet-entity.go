package entity

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

type WalletEntity struct {
	ID            bson.ObjectId  `json:"_id" bson:"_id"`
	ProfileID     bson.ObjectId  `json:"profileid" bson:"profileid"`
	Transfer      TransferEntity `json:"transfer" bson:"transfer"`
	CurrentWallet int32          `json:"currentwallet" bson:"currentwallet"`
}

type TransferEntity struct {
	Trans   []HookEntity            `json:"trans" bson:"trans"`
	History []TransferHistoryEntity `json:"history" bson:"history"`
}

type TransferHistoryEntity struct {
	Time   time.Time `json:"time" bson:"time"`
	Note   string    `json:"note" bson:"note"`
	Amount string    `json:"amount" bson:"amount"`
}

type HookEntity struct {
	Signature   string `json:"signature" bson:"signature"`
	Phone       string `json:"phone" bson:"phone"`
	TranId      string `json:"tranId" bson:"tranId"`
	AckTime     string `json:"ackTime" bson:"ackTime"`
	PartnerId   string `json:"partnerId" bson:"partnerId"`
	PartnerName string `json:"partnerName" bson:"partnerName"`
	Amount      string `json:"amount" bson:"amount"`
	Comment     string `json:"comment" bson:"comment"`
}

type GetInfoWalletEntity struct {
	ProfileID     bson.ObjectId `json:"profileid" bson:"profileid"`
	CurrentWallet int32         `json:"currentwallet" bson:"currentwallet"`
	SumPaid       int32         `json:"sumpaid" bson:"sumpaid"`
}

type GetHistoryWalletEntity struct {
	ProfileID bson.ObjectId         `json:"profileid" bson:"profileid"`
	History   TransferHistoryEntity `json:"history" bson:"history"`
}
