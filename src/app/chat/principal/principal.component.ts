import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Message } from '../message';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit{
  text: string = '';
  userId: number = 1;
  messageList: any[] = [];

  constructor(private chatService:ChatService){

  }

  ngOnInit(): void {
      this.chatService.joinRoom("ABC");
      this.receivedMessage();
  }

  sendMessage(){
    this.text = this.text.replace(/\n/g, '');
    const message = {
      message: this.text,
      user: 1
    } as Message
    this.chatService.sendMessage("ABC", message)
    this.text = '';
    console.log(message.user === this.userId ? 'your' : 'friend')
  }

  receivedMessage(){
      this.chatService.getMessageSubject().subscribe((messages: any) =>{
        this.messageList = messages.map((item:Message) => ({
          ...item,
          message_user: item.user === this.userId ? 'your' : 'friend'
        }))
      });
  }
}
