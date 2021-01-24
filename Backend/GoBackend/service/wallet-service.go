package service

import (
	"GoBackend/entity"
	mongodbservice "GoBackend/service/repository-service"
	"fmt"
	"os"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const WalletCollection = "Wallet"

type WalletService interface {
	NewWalletforProfile(profileid bson.ObjectId) (bson.ObjectId, error)
	GetInfoWallet(idprofile bson.ObjectId) (entity.GetInfoWalletEntity, error)
	SpendWallet() error
	PayWallet(profileid bson.ObjectId, enti entity.HookEntity) error
	GetTransDetailWallet(idprofile bson.ObjectId) ([]entity.HookEntity, error)
}

type WalletDataService struct {
	collection *mgo.Collection
}

func NewWalletService() (WalletService, error) {
	sec, err := mongodbservice.NewDBService()
	if err != nil {
		msg := fmt.Sprintf("[ERROR] Database connect faile: %s", err.Error())
		fmt.Println(msg)
		return nil, err
	}
	return &WalletDataService{
		collection: sec.GetDatabase(os.Getenv("NAME_DATABASE")).C(WalletCollection),
	}, nil
}

func (c *WalletDataService) GetInfoWallet(idprofile bson.ObjectId) (entity.GetInfoWalletEntity, error) {
	var result entity.WalletEntity
	err := c.collection.Find(bson.M{"profileid": idprofile}).One(&result)

	if err != nil || result.ProfileID != idprofile {
		return entity.GetInfoWalletEntity{}, err
	}

	var sumpaid int32 = 0

	for i := 0; i < len(result.Transfer.Trans); i++ {
		sumpaid += result.Transfer.Trans[i].Amount
	}

	resuftInfo := entity.GetInfoWalletEntity{
		ProfileID:     result.ProfileID,
		CurrentWallet: result.CurrentWallet,
		SumPaid:       sumpaid,
	}

	return resuftInfo, nil
}

func (c *WalletDataService) NewWalletforProfile(profileid bson.ObjectId) (bson.ObjectId, error) {

	wallet := &entity.WalletEntity{
		ID:            bson.NewObjectId(),
		ProfileID:     profileid,
		CurrentWallet: 0,
		Transfer: entity.TransferEntity{
			Trans:   []entity.HookEntity{},
			History: []entity.TransferHistoryEntity{},
		},
	}
	err := c.collection.Insert(&wallet)

	if err != nil {
		return "", err
	}
	return wallet.ID, nil
}

func (c *WalletDataService) SpendWallet() error {
	return nil
}

func (c *WalletDataService) PayWallet(profileid bson.ObjectId, enti entity.HookEntity) error {
	pushQuery := bson.M{"transfer.trans": enti}
	err := c.collection.Update(bson.M{"profileid": profileid}, bson.M{"$push": pushQuery, "$inc": bson.M{"currentwallet": enti.Amount}})
	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	return nil
}

func (c *WalletDataService) GetTransDetailWallet(idprofile bson.ObjectId) ([]entity.HookEntity, error) {
	var result entity.WalletEntity
	err := c.collection.Find(bson.M{"profileid": idprofile}).One(&result)

	if err != nil || result.ProfileID != idprofile {
		return []entity.HookEntity{}, err
	}

	// var sumpaid int32 = 0

	// for i := 0; i < len(result.Transfer.Trans); i++ {
	// 	sumpaid += result.Transfer.Trans[i].Amount
	// }

	// resuftInfo := entity.GetTransWalletEntity{
	// 	ProfileID: result.ProfileID,
	// 	Trans:     result.Transfer.Trans,
	// }

	return result.Transfer.Trans, nil
}
