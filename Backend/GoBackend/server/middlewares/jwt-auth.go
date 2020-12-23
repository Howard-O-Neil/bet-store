package middlewares

import (
	"GoBackend/entity"
	"GoBackend/service"
	"fmt"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func AuthorizeJWT() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString := ctx.GetHeader("Authentication")
		//fmt.Println(tokenString)
		if tokenString != "" {
			bearerToken := strings.Split(tokenString, " ")
			if len(bearerToken) == 2 {
				if bearerToken[0] == "Bearer" {
					token, err := service.NewJwtService().ValidateToken(bearerToken[1])
					if err == nil {
						if token.Valid {
							claims := token.Claims.(jwt.MapClaims)
							claimobj := entity.JwtClaimEntity{
								ID:   fmt.Sprintf("%v", claims["id"]),
								User: fmt.Sprintf("%v", claims["user"]),
							}
							ctx.Set("ClaimJwt", claimobj)
							ctx.Next()
						} else {
							ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusUnauthorized, "Token wrong"))
							ctx.Abort()
						}
					} else {
						ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusUnauthorized, err.Error()))
						ctx.Abort()
					}
				} else {
					ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusUnauthorized, "Token type wrong"))
					ctx.Abort()
				}
			} else {
				ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusUnauthorized, "Token not accepted"))
				ctx.Abort()
			}
		} else {
			ctx.JSON(http.StatusOK, service.CreateMsgErrorJsonResponse(http.StatusUnauthorized, "Unauthorized"))
			ctx.Abort()
		}

	}
}
