import { Component, OnInit } from '@angular/core';
import { MessageService, Message } from '../services/message.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  orderedMessages: Message[];

  constructor(private messageService: MessageService) { 
  }

  ngOnInit() {
    // This is run each time the bottomSheet is opened; we want latest message on top
    let msgSort = (x: Message, y: Message) => x.timestamp > y.timestamp ? -1 : 1;
    this.orderedMessages = this.messageService.messages.sort(msgSort);
  }
}
