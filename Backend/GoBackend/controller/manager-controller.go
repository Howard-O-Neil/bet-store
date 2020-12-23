package controller

import (
	"GoBackend/service"
	mongodbservice "GoBackend/service/repository-service"
)

var Databaseservice mongodbservice.DBService
var categoryservice service.CategoryService
var Sliderservice service.SliderService
var Profileservice service.ProfileService
var AccountService service.AccountService
var Walletservice service.WalletService
var Transferservice service.TransferService

func InitController() error {
	//NewDatabaseService
	var err error
	Databaseservice, err = mongodbservice.NewDBService()
	if err != nil {
		return err
	}

	//NewCategoryService
	categoryservice, err = service.NewCategoryService()
	if err != nil {
		return err
	}

	//NewSliderService
	Sliderservice, err = service.NewSliderService()
	if err != nil {
		return err
	}

	//NewProfileService
	Profileservice, err = service.NewProfileService()
	if err != nil {
		return err
	}

	//NewAccountService
	AccountService, err = service.NewAccountService()
	if err != nil {
		return err
	}

	//NewWalletService
	Walletservice, err = service.NewWalletService()
	if err != nil {
		return err
	}

	//NewTransferService
	Transferservice, err = service.NewTransferService()
	if err != nil {
		return err
	}

	return nil
}
