import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Message } from '../message';
import { isNgTemplate } from '@angular/compiler';
import { Contact } from '../contact';
import { User } from '../user';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit{
  text: string = '';
  user!: User;
  messageList: any[] = [];
  contacts:Contact[] = [];
  userId!: number;

  constructor(private chatService:ChatService){

  }

  ngOnInit(): void {
      this.user = this.chatService.getUser();
      this.contacts = this.chatService.getContacts();
      this.chatService.joinRoom(44444444444/*this.user.telephone*/);
      this.receivedMessage(); 
  }

  sendMessage(friendTelephone:number){
    this.text = this.text.replace(/\n/g, '');
    const message = {
      message: this.text,
      user: 1
    } as Message
    this.chatService.sendMessage(friendTelephone, message)
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
