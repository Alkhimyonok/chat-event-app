public with sharing class ChatController {
    public static IChatService chatService;

    static {
        chatService = new ChatService();
    }

    @AuraEnabled
    public static void notifyAboutMessage(Id messageId) {
        System.debug('HERE');
        chatService.notifyAboutMessage(messageId);
    }

}