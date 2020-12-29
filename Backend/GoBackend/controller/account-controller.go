package controller

import (
	"GoBackend/entity"
	"GoBackend/service"
	mongodbservice "GoBackend/service/repository-service"
	"GoBackend/utility"
	"regexp"

	"fmt"
	"net/http"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"
)

type KeyCodeTel struct {
	Time time.Time `json:"time" bson:"time"`
	Tel  string    `json:"tel" bson:"tel"`
	Key  string    `json:"key" bson:"key"`
}

func LoginHandle(ctx *gin.Context) {
	var account entity.AccountEntity
	ctx.BindJSON(&account)
	//fmt.Println(account.Password)
	//fmt.Println(account)
	sec, err := mongodbservice.NewDBService()
	if err != nil {
		msg := fmt.Sprintf("[ERROR] Database connect faile: %s", err.Error())
		fmt.Println(msg)
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": msg})
		return
	}

	c := sec.GetDatabase(os.Getenv("NAME_DATABASE")).C("Account")

	query := c.Find(bson.M{"username": account.Username})

	if n, _ := query.Count(); n == 1 {
		serviceSecure := service.NewJwtService()
		var acc entity.AccountEntity
		query.One(&acc)

		if CheckPasswordHash(account.Password, acc.Password) {
			token := serviceSecure.GenerationToken(acc.ID.Hex(), acc.Username)
			//fmt.Println(acc)
			ctx.JSON(http.StatusOK, service.CreateMsgSuccessJsonResponse(gin.H{"token": token})) //gin.H{"token": token})
		} else {
			ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(1006, "Password wrong!!!"))
		}

	} else {
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(1005, "Username not exist!!!"))
	}
}

type BsonAccountEntity struct {
	ID       bson.ObjectId `json:"_id" bson:"_id"`
	Username string        `json:"username" bson:"username"`
	Password string        `json:"password" bson:"password"`
	Tel      string        `json:"tel" bson:"tel"`
}

func SignupHandle(ctx *gin.Context) {
	var account entity.AccountEntity
	ctx.BindJSON(&account)
	account.Password, _ = HashPassword(account.Password)
	//fmt.Println(account.Password)
	sec, err := mongodbservice.NewDBService()
	if err != nil {
		msg := fmt.Sprintf("[ERROR] Database connect faile: %s", err.Error())
		fmt.Println(msg)
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": msg})
		return
	}

	c := sec.GetDatabase(os.Getenv("NAME_DATABASE")).C("Account")

	query := c.Find(bson.M{"username": account.Username})

	if n, _ := query.Count(); n >= 1 {
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(1007, "Username already exists"))
		return
	}
	account.ID = bson.NewObjectId()
	savedata := BsonAccountEntity{
		ID:       account.ID,
		Username: account.Username,
		Password: account.Password,
		Tel:      account.Tel,
	}
	err = c.Insert(&savedata)

	if err != nil {
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusConflict, err.Error()))
	}
	account.Profile.AccountID = account.ID
	account.Profile.Username = account.Username
	idProfile, err := Profileservice.AddProfile(account.Profile)

	if err != nil {
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusConflict, err.Error()))
	} else {
		_, err = Walletservice.NewWalletforProfile(idProfile)
		if err != nil {
			fmt.Println("[AccountSignup] Create wallet fail: " + err.Error())
		}
		ctx.JSON(http.StatusOK, service.CreateMsgSuccessJsonResponse(gin.H{"msg": "Account created"}))
	}
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func ChangePasswordHandle(ctx *gin.Context) {
	var passwordChangeEntity entity.PasswordChangeEntity
	err := ctx.BindJSON(&passwordChangeEntity)
	if err != nil {
		ctx.JSON(200, service.CreateMsgErrorJsonResponse(http.StatusBadRequest, "format body wrong"))
		return
	}

	ClaimJwt, _ := ctx.Get("ClaimJwt")

	var data, _ = ClaimJwt.(entity.JwtClaimEntity)

	passoldDB, err := AccountService.GetPassword(data.ID)
	if err != nil {
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusFound, err.Error()))
		return
	}
	fmt.Println(passoldDB + ", " + passwordChangeEntity.OldPassword)

	if CheckPasswordHash(passwordChangeEntity.OldPassword, passoldDB) {
		passHashed, err := HashPassword(passwordChangeEntity.NewPassword)

		err = AccountService.ChangePassword(data.ID, passHashed)
		if err != nil {
			ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusFound, err.Error()))
			return
		}
		ctx.JSON(http.StatusOK, service.CreateMsgSuccessJsonResponse(gin.H{"message": "Password change success"}))

	} else {
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusFound, "Password wrong"))
		return
	}
}

func ConfirmTelbySMS(ctx *gin.Context) {
	var account entity.AccountEntity
	ctx.BindJSON(&account)
	sec, err := mongodbservice.NewDBService()
	if err != nil {
		msg := fmt.Sprintf("[ERROR] Database connect faile: %s", err.Error())
		fmt.Println(msg)
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": msg})
		return
	}
	isTel, _ := regexp.Match(`([\d\(][\(\)\s\.\-\d]{9,11}\d)`, []byte(account.Tel))

	if isTel == false {
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": "Telephone wrong!!!"})
		return
	}

	c := sec.GetSession().DB(os.Getenv("NAME_DATABASE")).C("KeyCodeTel")

	keyCodeTel := KeyCodeTel{Tel: account.Tel, Time: time.Now(), Key: utility.GenerateKeycode()}

	if n, _ := c.Find(bson.M{"tel": account.Tel}).Count(); n > 5 {
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": "You have been limited to the number of submissions!!!"})
		return
	}

	err = service.SendKeycode(keyCodeTel.Tel, keyCodeTel.Key)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": "Server too load. Please try again!!!"})
		return
	}

	err = c.Insert(&keyCodeTel)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": err})
	} else {
		ctx.JSON(200, gin.H{"msg": "Send keycode success"})
	}
}

func CheckTelbySMS(ctx *gin.Context) {
	var account entity.AccountEntity
	ctx.BindJSON(&account)
	sec, err := mongodbservice.NewDBService()
	if err != nil {
		msg := fmt.Sprintf("[ERROR] Database connect faile: %s", err.Error())
		fmt.Println(msg)
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": msg})
		return
	}

	c := sec.GetSession().DB(os.Getenv("NAME_DATABASE")).C("KeyCodeTel")

	var keyCodeTel KeyCodeTel
	c.Find(bson.M{"tel": account.Tel, "key": account.Keycode}).One(&keyCodeTel)
	fmt.Println(keyCodeTel)
	if keyCodeTel == (KeyCodeTel{}) {
		ctx.JSON(http.StatusUnauthorized, gin.H{"msg": "Keycode wrong or expired!!!"})
		return
	}
	err = c.Remove(keyCodeTel)
	if err != nil {
		fmt.Errorf("%s\n", err)
	}
	ctx.JSON(http.StatusOK, gin.H{"msg": "Confirm tel success"})
}
