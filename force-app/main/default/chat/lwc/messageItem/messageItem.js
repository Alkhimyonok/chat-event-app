import {api, LightningElement} from 'lwc';

import {MessageWrapper, MessageWrapperBuilder} from "./messageWrapper";
export {MessageWrapper, MessageWrapperBuilder};

export default class MessageItem extends LightningElement {
    /**
     * @type {MessageWrapper}
     */
    _message;

    @api
    set message(message) {
        if (!message) {
            throw new Error();
        }
        this._message = message;
    }

    get message() {
        return this._message;
    }
}