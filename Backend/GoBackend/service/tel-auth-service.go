package service

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

func SendKeycode(tel string, keycode string) error {
	url := os.Getenv("URL_HOST_TEL")
	method := "POST"

	query := fmt.Sprintf("Body=%s&From=%s&To=%s", "Key confirm tel: "+keycode, os.Getenv("TEL_HOST"), tel)
	payload := strings.NewReader(query)

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		fmt.Printf("%s\n", err)
		return err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Basic %s", os.Getenv("AUTH_KEY")))
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	res, err := client.Do(req)
	if err != nil {
		fmt.Printf("%s\n", err)
		return err
	}
	defer res.Body.Close()

	if res.StatusCode == 201 {
		return nil
	}
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Printf("%s\n", err)
		return err
	}
	fmt.Printf("%s\n", string(body))
	return errors.New(string(body))
}
