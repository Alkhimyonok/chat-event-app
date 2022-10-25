import {LightningElement, track, wire} from 'lwc';
import {createRecord, getRecord} from "lightning/uiRecordApi";
import {subscribe, unsubscribe} from 'lightning/empApi';

import notifyAboutMessageApex from '@salesforce/apex/ChatController.notifyAboutMessage';

import MESSAGE_OBJECT from "@salesforce/schema/Message__c";
import MESSAGE_BODY_FIELD from "@salesforce/schema/Message__c.Body__c";
import MESSAGE_ID_FIELD from '@salesforce/schema/Message__c.Id';
import MESSAGE_USER_ALIAS_FIELD from '@salesforce/schema/Message__c.User_Alias__c';
import MESSAGE_CREATED_DATE_FIELD from '@salesforce/schema/Message__c.CreatedDate';

//message field list used in the getRecord @wire method, name shouldn't be changed
const fields = [MESSAGE_ID_FIELD, MESSAGE_BODY_FIELD, MESSAGE_USER_ALIAS_FIELD, MESSAGE_CREATED_DATE_FIELD];

import EVENT_MESSAGE_ID_FIELD from "@salesforce/schema/Chat_Event__e.Message_Id__c";
const CHANNEL_NAME = '/event/Chat_Event__e';

import {MessageWrapperBuilder} from "c/messageItem";

export default class Chat extends LightningElement {
    /**
     * @type {MessageWrapper[]}
     */
    @track messages = [];
    receivedMessageId = '';
    subscription;


    connectedCallback() {
        this.subscribeOnChatEvent()
    }

    async handleSend(event) {
        event.stopPropagation();
        const fields = {};

        fields[MESSAGE_BODY_FIELD.fieldApiName] = event.detail;

        const recordInput = {
            apiName: MESSAGE_OBJECT.objectApiName,
            fields: fields
        };

        const newMessageRecord = await createRecord(recordInput);
        this.notifyAboutMessageApex(newMessageRecord.id);
    }

    notifyAboutMessageApex(messageId) {
        notifyAboutMessageApex({messageId: messageId});
    }

    subscribeOnChatEvent() {
        const thisRef = this;
        const receiveMessageHandler = function (response) {
            thisRef.receivedMessageId = response.data.payload[EVENT_MESSAGE_ID_FIELD.fieldApiName];
        };

        subscribe(CHANNEL_NAME, -1, receiveMessageHandler).then(response => {
            this.subscription = response;
        });
    }

    @wire(getRecord, {
        recordId: '$receivedMessageId',
        fields
    })
    getMessageRecord({error, data}) {
        if (data) {
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