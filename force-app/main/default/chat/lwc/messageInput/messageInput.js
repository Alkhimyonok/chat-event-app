import {LightningElement} from 'lwc';

const SEND_EVENT_NAME = 'send';
const ENTER_KEY_NAME = 'Enter';
const INPUT_MESSAGE_SELECTOR = '.input-message';

export default class MessageInput extends LightningElement {

    messageBody = '';

    handleSendMessage() {
        const inputMessageElement = this.template.querySelector(INPUT_MESSAGE_SELECTOR);
        const messageBody = inputMessageElement.value;

        this.dispatchEvent(new CustomEvent(SEND_EVENT_NAME, {'detail': messageBody}));
        inputMessageElement.value = '';
    }

    handleKeyPress(event) {
        if (event.key === ENTER_KEY_NAME) {
            this.handleSendMessage();
        }
    };
}