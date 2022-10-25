public with sharing class ChatController {
    public static IChatService chatService = new ChatService();

    @AuraEnabled
    public static void notifyAboutMessage(Id messageId) {
        chatService.notifyAboutMessage(messageId);
    }

}