package route

import (
	"GoBackend/controller"
	"GoBackend/server/middlewares"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetRoute(app *gin.Engine) *gin.Engine {
	RouteAccount(app)
	RouteCategory(app)
	RouteContentStatic(app)
	RouteProfile(app)
	RouteHookWallet(app)
	RouteWallet(app)

	RouteTest(app)
	//Route have auth
	appauth := app.Group("/a", middlewares.AuthorizeJWT())

	RouteAuth(appauth)
	return app
}

func RouteAccount(app *gin.Engine) {
	app.POST("api/account/login", controller.LoginHandle)

	app.POST("api/account/signup", controller.SignupHandle)

	app.POST("api/account/password", middlewares.AuthorizeJWT(), controller.ChangePasswordHandle)
	//app.POST("api/account/sendsms", controller.ConfirmTelbySMS)

	//app.POST("api/account/checkkeycode", controller.CheckTelbySMS)
}

func RouteCategory(app *gin.Engine) {
	app.GET("/category/", controller.LoadCategory)
	app.POST("/category/", controller.CreateCategory)

}

func RouteTest(app *gin.Engine) {
	app.GET(
		"/",
		func(ctx *gin.Context) {
			ctx.JSON(200, gin.H{"active": "true"})
		})

	//app.Use(middlewares.Logger())
	app.GET(
		"/testauth/",
		middlewares.AuthorizeJWT(),
		func(ctx *gin.Context) {
			hh, _ := ctx.Get("ClaimJwt")
			//var vive, _ = hh.(entity.JwtClaimEntity)

			ctx.JSON(200, gin.H{"auth": hh})
		})
}

func RouteContentStatic(app *gin.Engine) {
	app.GET("/slider/", controller.LoadSlider)
	app.POST("/slider/", controller.CreateSlider)
}

func RouteAuth(app *gin.RouterGroup) {
	app.GET(
		"/secure/",
		func(ctx *gin.Context) {
			ctx.JSON(http.StatusOK, gin.H{"secure": "active"})
		})
}

func RouteProfile(app *gin.Engine) {
	app.GET(
		"/profile/",
		middlewares.AuthorizeJWT(),
		controller.LoadProfile)
	app.POST(
		"/profile/",
		middlewares.AuthorizeJWT(),
		controller.EditProfile)
}

func RouteHookWallet(app *gin.Engine) {
	app.POST(
		"/api/webhookwallet",
		controller.WebhookWalletHandle)
}

func RouteWallet(app *gin.Engine) {
	app.GET(
		"/wallet/",
		middlewares.AuthorizeJWT(),
		controller.GetInfoWallet)
}
