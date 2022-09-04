import {api, LightningElement} from 'lwc';

export default class MessageHistory extends LightningElement {
    /**
     *
     * @type MessageWrapper[]
     */
    @api _messages;

    @api
    set messages(messages) {
        if (!messages) {
            throw new Error();
        }

        this._messages = messages;
    }

    get messages() {
        return this._messages;
    }

    renderedCallback() {
        const scrollArea = this.template.querySelector('.slds-scrollable_y');
        scrollArea.scrollTop = scrollArea.scrollHeight;
    }

}