import { Injectable } from '@angular/core';
//import { from } from 'rxjs/internal/observable/from';
import { Observable, Subject } from 'rxjs';

export enum MessageType {
  info,
  warning,
  error
}

export class Message {
  type: MessageType;
  displayText: string;
  timestamp: Date;
}

@Injectable()
export class MessageService {
  messages: Message[] = [];
  subject: Subject<Message> = new Subject<Message>();
  publishedMessages: Observable<Message> = this.subject.asObservable();

  constructor() { }

  add = (type: MessageType, displayMessage: string) => {
    let message = new Message();
    message.type = type;
    message.displayText = displayMessage;
    message.timestamp = new Date();
    this.messages.push(message); 
    this.subject.next(message);
  }

  clear() {
    this.messages = [];
  }
}