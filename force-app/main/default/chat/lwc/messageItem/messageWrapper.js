export {MessageWrapper, MessageWrapperBuilder};

class MessageWrapper {
    /**
     * type {String}
     */
    id;

    /**
     * type {String}
     */
    body;

    /**
     * type {String}
     */
    userAlias;

    /**
     * type {Date}
     */
    createdDate;
}

class MessageWrapperBuilder {

    wrapper;

    constructor() {
        this.wrapper = new MessageWrapper();
    }

    withId(id) {
        this.wrapper.id = id;
        return this;
    }

    withBody(body) {
        this.wrapper.body = body;
        return this;
    }

    withUserAlias(userAlias) {
        this.wrapper.userAlias = userAlias;
        return this;
    }

    withCreatedDate(createdDate) {
        this.wrapper.createdDate = new Date(createdDate);
        return this;
    }

    build() {
        const {id, body, userAlias, createdDate} = this.wrapper;
        if (!id || !body || !createdDate) {
            throw Error();
        }

        if (!userAlias) {
            this.wrapper.userAlias = 'noName';//todo: const label
        }

        return this.wrapper;
    }
}