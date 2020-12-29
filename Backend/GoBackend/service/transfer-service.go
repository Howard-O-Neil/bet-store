package service

import (
	"GoBackend/entity"
	mongodbservice "GoBackend/service/repository-service"
	"fmt"
	"os"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const TransferCollection = "Transfer"

type TransferService interface {
	AddTransfer(enti entity.HookEntity) error
	GetAllTransfer() ([]entity.HookEntity, error)
}

type TransferDataService struct {
	collection *mgo.Collection
}

func NewTransferService() (TransferService, error) {
	sec, err := mongodbservice.NewDBService()
	if err != nil {
		msg := fmt.Sprintf("[ERROR] Database connect faile: %s", err.Error())
		fmt.Println(msg)
		return nil, err
	}
	return &TransferDataService{
		collection: sec.GetDatabase(os.Getenv("NAME_DATABASE")).C(TransferCollection),
	}, nil
}

func (c *TransferDataService) GetAllTransfer() ([]entity.HookEntity, error) {
	var result []entity.HookEntity
	err := c.collection.Find(bson.M{}).All(&result)

	if err != nil {
		return nil, err
	}
	return result, nil
}

func (c *TransferDataService) AddTransfer(enti entity.HookEntity) error {
	err := c.collection.Insert(&enti)
	if err != nil {
		return err
	}
	return nil
}
