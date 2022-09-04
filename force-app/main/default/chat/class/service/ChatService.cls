public with sharing class ChatService implements IChatService {

    public void notifyAboutMessage(String messageId) {
        System.debug('now here');
        Chat_Event__e event = new Chat_Event__e(Message_Id__c = messageId);

        Database.SaveResult result = EventBus.publish((SObject) event);
        System.debug(result);
    }
}