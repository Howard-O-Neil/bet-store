package entity

type MsgReponseErrorEntity struct {
	Status int    `json:"status"`
	Message  string `json:"message"`
}
type MsgReponseSuccessEntity struct {
	Status int         `json:"status"`
	Data   interface{} `json:"data"`
}
