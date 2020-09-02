import { EventEmitter } from '@angular/core';

export class ModalBase {
    title: string;
    text: string;
    data: any;
    output: EventEmitter<any>;
    onConfirm: (data?) => any | void;
    getData: () => any;
    eventEmitter: EventEmitter<any>;
    // static CreateFixedText(_data: any = null, _eventEmitter: EventEmitter<any> = null, _onConfirm: () => any | void = null): ModalBase {
    //     const modalBase: ModalBase = new ModalBase();
    //     modalBase.data = _data;
    //     modalBase.onConfirm = _onConfirm;
    //     modalBase.eventEmitter = _eventEmitter;
    //     return modalBase;
    // }
    constructor(title: string = null, text: string = null, data: any = null,
                eventEmitter: EventEmitter<any> = null, onConfirm: (data?) => any | void = null, getData: () => any = null) {
        this.title = title;
        this.text = text;
        this.data = data;
        this.onConfirm = onConfirm;
        this.getData = getData;
        this.eventEmitter = eventEmitter;
    }

    static InstanceWithoutText = (data: any = null, eventEmitter: EventEmitter<any> = null, onConfirm: () => any | void = null) =>
           new ModalBase(null, null, data, eventEmitter, onConfirm)
}



