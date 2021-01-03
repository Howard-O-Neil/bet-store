package controller

import (
	"GoBackend/entity"
	"GoBackend/service"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LoadProfile(ctx *gin.Context) {

	ClaimJwt, _ := ctx.Get("ClaimJwt")

	var data, _ = ClaimJwt.(entity.JwtClaimEntity)

	//ctx.JSON(200, gin.H{"auth": data.ID})

	k, err := Profileservice.GetProfile(data.ID)

	//ctx.JSON(200, gin.H{"auth": k})

	//return

	if err != nil {
		fmt.Printf("[LoadProfile] Not loadding: %s\n", err.Error())
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusExpectationFailed, "Load error: "+err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, service.CreateMsgSuccessJsonResponse(k))
}

func EditProfile(ctx *gin.Context) {

	ClaimJwt, _ := ctx.Get("ClaimJwt")

	var data, _ = ClaimJwt.(entity.JwtClaimEntity)
	var profile entity.ProfileEntity
	ctx.BindJSON(&profile)
	fmt.Println(profile)
	//ctx.JSON(200, gin.H{"auth": data.ID})

	err := Profileservice.EditProfile(data.ID, profile)

	//ctx.JSON(200, gin.H{"auth": k})

	//return

	if err != nil {
		fmt.Printf("[EditProfile] Not modified: %s\n", err.Error())
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusNotModified, "Not modified: "+err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, service.CreateMsgSuccessJsonResponse("Profile modified"))
}

// func CreateProfile(ctx *gin.Context) {
// 	var enti entity.ProfileEntity

// 	err := ctx.BindJSON(&enti)

// 	if err != nil {
// 		fmt.Printf("[CreateProfile] Map data failre: %s\n", err.Error())
// 		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusBadRequest, "Map data failre"))
// 		return
// 	}
// 	//fmt.Println(enti)

// 	id, err := Profileservice.AddProfile(enti)

// 	if err != nil {
// 		fmt.Printf("[CreateProfile] Not loadding: %s\n", err.Error())
// 		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusBadRequest, "Create error: "+err.Error()))
// 		return
// 	}
// 	ctx.JSON(http.StatusOK, service.CreateMsgSuccessJsonResponse(gin.H{"_id": id}))
// }
