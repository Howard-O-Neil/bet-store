package controller

import (
	"GoBackend/entity"
	"GoBackend/service"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LoadSlider(ctx *gin.Context) {
	k, err := Sliderservice.GetAllSlider()

	if err != nil {
		fmt.Printf("[LoadCategory] Not loadding: %s\n", err.Error())
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusExpectationFailed, "Load error: "+err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, service.CreateMsgSuccessJsonResponse(k))
}

func CreateSlider(ctx *gin.Context) {
	var enti entity.SliderEntity

	err := ctx.BindJSON(&enti)

	if err != nil {
		fmt.Printf("[CreateSlider] Map data failre: %s\n", err.Error())
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusBadRequest, "Map data failre"))
		return
	}
	//fmt.Println(enti)

	id, err := Sliderservice.AddSlider(enti)

	if err != nil {
		fmt.Printf("[CreateSlider] Not loadding: %s\n", err.Error())
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusBadRequest, "Create error: "+err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, service.CreateMsgSuccessJsonResponse(gin.H{"_id": id}))
}

type ID_Slider struct {
	ID string `json:"_id,omitempty" bson:"_id,omitempty"`
}

func DelSlider(ctx *gin.Context) {
	var enti ID_Slider

	err := ctx.BindJSON(&enti)

	if err != nil {
		fmt.Printf("[DelSlider] Map data failre: %s\n", err.Error())
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusBadRequest, "Map data failre"))
		return
	}

	id, err := Sliderservice.DelSlider(enti.ID)

	if err != nil {
		fmt.Printf("[DelSlider] Not delete: %s\n", err.Error())
		ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusBadRequest, "Create error: "+err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, service.CreateMsgSuccessJsonResponse(gin.H{"_id": id}))
}
