package service

import (
	"GoBackend/entity"
	mongodbservice "GoBackend/service/repository-service"
	"fmt"
	"os"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const SliderCollection = "Slider"

type SliderService interface {
	AddSlider(enti entity.SliderEntity) (bson.ObjectId, error)
	GetAllSlider() ([]entity.SliderEntity, error)
	EditSlider(enti entity.SliderEntity) (bson.ObjectId, error)
	DelSlider(id string) (bson.ObjectId, error)
}

type SliderDataService struct {
	collection *mgo.Collection
}

func NewSliderService() (SliderService, error) {
	sec, err := mongodbservice.NewDBService()
	if err != nil {
		msg := fmt.Sprintf("[ERROR] Database connect faile: %s", err.Error())
		fmt.Println(msg)
		return nil, err
	}
	return &SliderDataService{
		collection: sec.GetDatabase(os.Getenv("NAME_DATABASE")).C(SliderCollection),
	}, nil
}

func (c *SliderDataService) GetAllSlider() ([]entity.SliderEntity, error) {
	var result []entity.SliderEntity
	err := c.collection.Find(bson.M{}).All(&result)

	if err != nil {
		return nil, err
	}
	return result, nil
}

func (c *SliderDataService) AddSlider(enti entity.SliderEntity) (bson.ObjectId, error) {
	_id := bson.NewObjectId()
	enti.ID = _id
	err := c.collection.Insert(&enti)

	//handle more...

	//

	if err != nil {
		return "", err
	}
	return _id, nil
}

func (c *SliderDataService) EditSlider(enti entity.SliderEntity) (bson.ObjectId, error) {
	err := c.collection.Update(bson.M{"_id": enti.ID}, bson.M{"$set": bson.M{"link": enti.Link, "alt": enti.Alt, "href": enti.Href}})
	return enti.ID, err
}

func (c *SliderDataService) DelSlider(id string) (bson.ObjectId, error) {

	fmt.Println(id)
	objectId := bson.ObjectIdHex(id)

	err := c.collection.Remove(bson.M{"_id": objectId})

	if err != nil {
		return "", err
	}
	return objectId, nil

	//return "", nil
}
