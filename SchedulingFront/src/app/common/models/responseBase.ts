export class ResponseBase<T> {
    messages: Array<ResponseMessage>;
    data: T;
    status: ResponseStatus;
    count: number;

    constructor() {
        this.messages = new Array<ResponseMessage>();
    }
}

export class ResponseMessage {
    value: string;
    code: string;
}

export enum ResponseStatus { Success, Error }
