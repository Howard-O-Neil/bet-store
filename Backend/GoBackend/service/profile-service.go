package service

import (
	"GoBackend/entity"
	mongodbservice "GoBackend/service/repository-service"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const ProfileCollection = "Profile"
const BASE_CDN_SERVER = "http://10.1.0.3:8888"

type JsonAvatarStruct struct {
	Avatar string `json:"avatar"`
}

type ProfileService interface {
	AddProfile(enti entity.ProfileEntity) (bson.ObjectId, error)
	GetProfile(ID string) (entity.ProfileEntity, error)
	EditProfile(ID string, profile entity.ProfileEntity) error
	DelProfile() (bson.ObjectId, error)
	GetProfilebyUsername(user string) (entity.ProfileEntity, error)
	GetInfoProfilebyAccountID(id string) (entity.ProfileEntity, error)
}

type ProfileDataService struct {
	collection *mgo.Collection
}

func NewProfileService() (ProfileService, error) {
	sec, err := mongodbservice.NewDBService()
	if err != nil {
		msg := fmt.Sprintf("[ERROR] Database connect fail: %s", err.Error())
		fmt.Println(msg)
		return nil, err
	}
	return &ProfileDataService{
		collection: sec.GetDatabase(os.Getenv("NAME_DATABASE")).C(ProfileCollection),
	}, nil
}

func (c *ProfileDataService) GetProfile(ID string) (entity.ProfileEntity, error) {
	//bsonID :=
	objectId := bson.ObjectIdHex(ID)

	//fmt.Println(objectId)

	var result entity.ProfileEntity
	err := c.collection.Find(bson.M{"accountID": objectId}).One(&result)

	// //fmt.Println(result)
	// returnResult := result.Profile
	// returnResult.Username = result.Username
	if err != nil {
		return result, err
	}
	return result, nil
}

func (c *ProfileDataService) AddProfile(enti entity.ProfileEntity) (bson.ObjectId, error) {
	_id := bson.NewObjectId()
	enti.ID = _id

	//handle more...

	//Add avatar random
	if enti.Sex == "" {
		enti.Sex = "men"
	}
	avatarRandom, err := GetAvatarRandomFromCDNServer(enti.Sex)

	if err != nil {
		fmt.Println(err.Error())
	}
	enti.Avatar = avatarRandom

	fmt.Println(enti)
	err = c.collection.Insert(&enti)
	if err != nil {
		return "", err
	}
	return _id, nil
}

func (c *ProfileDataService) EditProfile(ID string, profile entity.ProfileEntity) error {
	objectId := bson.ObjectIdHex(ID)
	fmt.Println(bson.M{"profile": objectId})

	err := c.collection.Update(bson.M{"accountID": objectId}, bson.M{"$set": profile})
	if err != nil {
		return err
	}
	return nil
}

func (c *ProfileDataService) DelProfile() (bson.ObjectId, error) {
	return "", nil
}

func GetAvatarRandomFromCDNServer(sex string) (string, error) {
	url := BASE_CDN_SERVER + "/avatar/" + sex
	method := "GET"

	client := &http.Client{}
	req, err := http.NewRequest(method, url, nil)

	if err != nil {
		fmt.Println(err)
		return "", err
	}
	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)

	if err != nil {
		fmt.Println(err)
		return "", err
	}

	var avatarJsonUnpack JsonAvatarStruct
	json.Unmarshal([]byte(string(body)), &avatarJsonUnpack)
	//json.NewDecoder(res.Body).Decode(avatarJsonUnpack)

	fmt.Println("----------------------")
	fmt.Println(string(body))

	fmt.Println(avatarJsonUnpack.Avatar)
	fmt.Println("----------------------")
	return string(avatarJsonUnpack.Avatar), nil
}

func (c *ProfileDataService) GetProfilebyUsername(user string) (entity.ProfileEntity, error) {
	var result entity.ProfileEntity
	err := c.collection.Find(bson.M{"username": user}).One(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func (c *ProfileDataService) GetInfoProfilebyAccountID(id string) (entity.ProfileEntity, error) {
	objectId := bson.ObjectIdHex(id)
	var profile entity.ProfileEntity
	err := c.collection.Find(bson.M{"accountID": objectId}).One(&profile)
	return profile, err
}
