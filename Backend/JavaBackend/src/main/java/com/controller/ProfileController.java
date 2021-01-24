package com.controller;

import com.App;
import com.service.ProfileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(App.service + "/profile")
@RestController
public class ProfileController {

  @Autowired
  private ProfileService profileService;

  @GetMapping("/get")
  public Response<Object> getProfile(
    @RequestParam(name = "accountid", required = true) String accountId
  ) throws Exception {
    var res = this.profileService.getProfile(accountId);

    if (res.isEmpty()) {
      return ResponseHandler.error(null);
    } else if (res.get().size() == 0) {
      return ResponseHandler.accountNotExisted(null);
    } else {
      return ResponseHandler.ok(res.get().get(0));
    }
  }
}
