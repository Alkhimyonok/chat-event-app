//todo:: const labels in html
import {LightningElement} from 'lwc';

const SEND_EVENT = 'send';
const ENTER_KEY = 'Enter';

export default class MessageInput extends LightningElement {

    messageBody = '';

    handleSendMessage() {
        this.dispatchEvent(new CustomEvent(SEND_EVENT, {'detail': this.messageBody}));
        this.messageBody = '';
    }

    handleChangeMessage(event) {
        this.messageBody = event.target.value;
    }

    handleKeyPress(event) {
        if (event.key === ENTER_KEY) {
            this.handleChangeMessage(event);
            this.handleSendMessage();
        }
    };
}