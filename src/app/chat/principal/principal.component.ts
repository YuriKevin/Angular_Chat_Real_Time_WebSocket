import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Message } from '../message';
import { isNgTemplate } from '@angular/compiler';
import { Contact } from '../contact';
import { User } from '../user';
import { Conversation } from '../conversation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit{
  text: string = '';
  user!: User;
  contacts:Contact[] = [];
  chatConversation!:Conversation;
  conversations:Conversation[] = [];

  constructor(private chatService:ChatService, private router:Router){

  }

  ngOnInit(): void {
    if(!this.user){//primeiro if pra quando o ngOnInit for iniciado pela segunda ou demais vezez
      this.user = this.chatService.getUser();
      if(!this.user){
        this.router.navigate(['/login']);
      }
    }
      this.contacts = this.chatService.getContacts();
      this.conversations = this.chatService.getConversations();

  }

  ngOnDestroy(): void {
    this.contacts = [];
    this.conversations = [];
  }

  sendMessage(friendTelephone:number){
    this.text = this.text.replace(/\n/g, '');
    const message = {
      message: this.text,
      user: this.user.telephone
    } as Message
    this.chatConversation.messages.push(message);
    this.chatConversation.lastMessage = message.message;
    this.chatService.sendMessage(friendTelephone, message);
    this.text = '';
  }

  selectChatConversation(conversation:Conversation){
    this.chatConversation = conversation;
  }
}

