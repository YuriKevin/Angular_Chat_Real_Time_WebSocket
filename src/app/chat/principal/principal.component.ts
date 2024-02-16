import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Message } from '../message';
import { isNgTemplate } from '@angular/compiler';
import { Contact } from '../contact';
import { User } from '../user';
import { Conversation } from '../conversation';

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
  chatConversation!:Conversation;
  conversations:Conversation[] = [];


  constructor(private chatService:ChatService){
    this.chatService.initConnectionSocket();
  }

  ngOnInit(): void {
      this.user = this.chatService.getUser();
      this.contacts = this.chatService.getContacts();
      this.chatService.joinRoom(this.user.telephone/*this.user.telephone*/);
      this.receivedMessage(); 

      this.contacts.forEach(contact => {
        const conversation: Conversation = {
            contact: contact,
            messages: [], 
            lastMessage: ''
        };
        this.conversations.push(conversation);
    });
  }

  sendMessage(friendTelephone:number){
    this.text = this.text.replace(/\n/g, '');
    const message = {
      message: this.text,
      user: this.user.telephone
    } as Message
    this.chatService.sendMessage(friendTelephone, message)
    this.text = '';
    console.log(message.user === this.userId ? 'your' : 'friend')
  }

  receivedMessage(){

    this.chatService.getMessageSubject().subscribe((messages: any) => {
      messages.forEach((item: Message) => {
        // Encontrar a conversa correspondente com base no ID do remetente
        const conversation = this.conversations.find(conversation => conversation.contact.telephone == item.user);
        if (conversation) {
          conversation.messages.push(item);
          conversation.lastMessage = item.message;
        }
        else{

        }
      });
    });
    /*
      this.chatService.getMessageSubject().subscribe((messages: any) =>{
        this.messageList = messages.map((item:Message) => ({
          ...item,
          message_user: item.user === this.userId ? 'your' : 'friend'
        }))
      });*/
  }

  selectChatConversation(conversation:Conversation){
    this.chatConversation = conversation;
  }
}

