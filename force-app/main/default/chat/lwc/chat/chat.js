//todo:: const labels in html
import {LightningElement, track, wire} from 'lwc';
import {createRecord, getRecord} from "lightning/uiRecordApi";
import {subscribe, unsubscribe} from 'lightning/empApi';

import notifyAboutMessageApex from '@salesforce/apex/ChatController.notifyAboutMessage';

import MESSAGE_OBJECT from "@salesforce/schema/Message__c";
import BODY_FIELD from "@salesforce/schema/Message__c.Body__c";

import MESSAGE_ID_FIELD from "@salesforce/schema/Chat_Event__e.Message_Id__c";

import {MessageWrapperBuilder} from "c/messageItem";

export default class Chat extends LightningElement {
    /**
     * @type {MessageWrapper[]}
     */
    @track messages = [];
    receivedMessageId = '';
    messageFields = ['Message__c.Id', 'Message__c.Body__c', 'Message__c.User_Alias__c', 'Message__c.CreatedDate'];

    channelName = '/event/Chat_Event__e';
    subscription;

    connectedCallback() {
        this.subscribeOnChatEvent()
    }

    async handleSend(event) {
        event.stopPropagation();
        const fields = {};

        fields[BODY_FIELD.fieldApiName] = event.detail;

        const recordInput = {
            apiName: MESSAGE_OBJECT.objectApiName,
            fields: fields
        };

        let messageId;
        await createRecord(recordInput).then((record) => {
            messageId = record.id;
        });
        await this.notifyAboutMessageApex(messageId);
    }

    async notifyAboutMessageApex(messageId) {
        await notifyAboutMessageApex({messageId: messageId});
    }

    subscribeOnChatEvent() {
        const thisRef = this;
        const receiveMessageHandler = function (response) {
            thisRef.receivedMessageId = response.data.payload[MESSAGE_ID_FIELD.fieldApiName];
        };

        subscribe(this.channelName, -1, receiveMessageHandler).then(response => {
            this.subscription = response;
        });
    }

    @wire(getRecord, {
        recordId: '$receivedMessageId',
        fields: '$messageFields'
    })
    getMessageRecord({error, data}) {
        if (data) {
            console.log(data.fields.CreatedDate.value);
            const item = new MessageWrapperBuilder()
                .withId(data.fields.Id.value)
                .withBody(data.fields.Body__c.value)
                .withUserAlias(data.fields.User_Alias__c.value)
                .withCreatedDate(data.fields.CreatedDate.value)
                .build();
            this.messages.push(item);
        }

    }

    async disconnectedCallback() {
        await unsubscribe(this.subscription);
    }

}