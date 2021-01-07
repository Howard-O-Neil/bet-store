package service

import (
	"GoBackend/entity"
	mongodbservice "GoBackend/service/repository-service"
	"fmt"
	"os"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const AccountCollection = "Account"

type AccountService interface {
	ChangePassword(id string, password string) error
	GetPassword(id string) (string, error)
	CheckUsernameExist(username string) (bool, error)
}

type AccountDataService struct {
	collection *mgo.Collection
}

func NewAccountService() (AccountService, error) {
	sec, err := mongodbservice.NewDBService()
	if err != nil {
		msg := fmt.Sprintf("[ERROR] Database connect faile: %s", err.Error())
		fmt.Println(msg)
		return nil, err
	}
	return &AccountDataService{
		collection: sec.GetDatabase(os.Getenv("NAME_DATABASE")).C(AccountCollection),
	}, nil
}

func (c *AccountDataService) ChangePassword(id string, password string) error {

	fmt.Println(password + ", " + id)
	objectId := bson.ObjectIdHex(id)

	err := c.collection.Update(bson.M{"_id": objectId}, bson.M{"$set": bson.D{{"password", password}}})
	if err != nil {
		return err
	}
	return nil
}

func (c *AccountDataService) GetPassword(id string) (string, error) {
	//bsonID :=
	objectId := bson.ObjectIdHex(id)
	var result entity.AccountEntity
	err := c.collection.Find(bson.M{"_id": objectId}).One(&result)
	if err != nil {
		return "", err
	}
	return result.Password, nil
}

func (c *AccountDataService) CheckUsernameExist(username string) (bool, error) {
	query := c.collection.Find(bson.M{"username": username})
	if n, _ := query.Count(); n >= 1 {
		return true, nil
	}
	return false, nil
}
