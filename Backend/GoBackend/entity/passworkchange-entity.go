package entity

type PasswordChangeEntity struct {
	OldPassword string `json:"oldpassword,omitempty"`
	NewPassword string `json:"newpassword,omitempty"`
}
