package com;

import com.dao.IConversationDao;
import com.dao.IMessageDao;
import com.helper.DatabaseSupplier;
import com.model.Message;
import com.model.MessageContentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class generateData1 extends testCasePrint {

  private IConversationDao conversationDao;
  private IMessageDao messageDao;

  @Autowired
  public void setConversationDao(
    @Qualifier(DatabaseSupplier.MongoDB.BetStore.Conversation) IConversationDao conversationDao,
    @Qualifier(DatabaseSupplier.MongoDB.BetStore.Message) IMessageDao messageDao
  ) {
    this.conversationDao = conversationDao;
    this.messageDao = messageDao;
  }

  @Test
  public void testCase1() throws Exception {
    this.run(
        () -> {
          String mingkhoi = "5fbd3a3970cb4d0161112b1d";
          String snoop = "5fbd43bb76af190165ad3f21";
          String ert = "5fbf6df930e7f6015fbdb1a1";

          for (int i = 0; i < 10; i++) {
            this.messageDao.insertMessage(
                new Message(
                  mingkhoi,
                  snoop,
                  String.format("test message %d", i),
                  null,
                  MessageContentType.CONTENT_NONE
                )
              );
              this.messageDao.insertMessage(
                new Message(
                  mingkhoi,
                  ert,
                  String.format("test message %d", i),
                  null,
                  MessageContentType.CONTENT_NONE
                )
              );
          }
          return null;
        }
      );
  }
}
