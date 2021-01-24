package com.service;

import java.util.List;
import java.util.Optional;

import com.dao.IProfileDao;
import com.helper.DatabaseSupplier;
import com.model.Profile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class ProfileService implements LogService {
  
  private IProfileDao profileDao;

  @Autowired
  ProfileService(
    @Qualifier(DatabaseSupplier.MongoDB.BetStore.Profile) IProfileDao profileDao
  ) {
    this.profileDao = profileDao;
  }

  public Optional<List<Profile>> getProfile(String accountId) {
    return this.run(
      () -> {
        return this.profileDao.getProfileByAccountId(accountId);
      }
    );
  }
}
