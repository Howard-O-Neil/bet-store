package com.dao;

import java.util.ArrayList;
import java.util.List;

import com.helper.DatabaseSupplier;
import com.helper.PropertyHelper;
import com.model.Profile;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Repository;

@Repository(DatabaseSupplier.MongoDB.BetStore.Profile)
public class ProfileDaoImpl implements IProfileDao {

  @Override
  public List<Profile> getProfileByAccountId(String accountId) throws Exception {
    return this.run(
      PropertyHelper.getMongoDBChat(), "Profile", collection -> {
        var filter = new Document("accountID", new ObjectId(accountId));
        var res = new ArrayList<Profile>();
        
        for (var doc : collection.find(filter)) {
          res.add(this.parseWithId(doc, Profile.class));
        }
        return res;
      });
  }  
}
