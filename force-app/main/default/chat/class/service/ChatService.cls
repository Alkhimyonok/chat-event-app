public with sharing class ChatService implements IChatService {

    public void notifyAboutMessage(String messageId) {
        Chat_Event__e event = new Chat_Event__e(Message_Id__c = messageId);
        EventBus.publish((SObject) event);
    }
}