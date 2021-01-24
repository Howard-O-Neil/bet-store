package com.dao;

import java.util.List;

import com.model.Profile;

public interface IProfileDao extends IDbQueryLogic {
  public List<Profile> getProfileByAccountId(String accountId) throws Exception;
}
