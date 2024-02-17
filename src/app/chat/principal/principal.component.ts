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
  messageList: any[] = [];
  contacts:Contact[] = [];
  userId!: number;
  chatConversation!:Conversation;
  conversations:Conversation[] = [];


  constructor(private chatService:ChatService, private router:Router){
    
  }

  ngOnInit(): void {
      this.user = this.chatService.getUser();
      if(!this.user){
        this.router.navigate(['/login']);
      }
      this.contacts = this.chatService.getContacts();
      
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
    this.chatConversation.messages.push(message);
    this.chatConversation.lastMessage = message.message;
    this.chatService.sendMessage(friendTelephone, message);
    this.text = '';
    console.log(message.user === this.userId ? 'your' : 'friend');
  }

  receivedMessage(){

    this.chatService.getMessageSubject().subscribe((messages: any) => {
      messages.forEach((item: Message) => {
        if(this.chatConversation && item.user==this.chatConversation.contact.telephone){
            console.log("funcionando1");
            this.chatConversation.messages.push(item);
            this.chatConversation.lastMessage = item.message;
        }
        else{
          const conversation = this.conversations.find(conversation => conversation.contact.telephone == item.user);
          if (conversation) {
            conversation.messages.push(item);
            console.log("funcionando2");
            conversation.lastMessage = item.message;
          }
          else{
            this.chatService.anonymousContact(item.user).subscribe((data: Contact)=>{
              this.chatService.addContactInArray(data);
              const conversation: Conversation = {
                contact: data,
                messages: [], 
                lastMessage: ''
              }
              this.conversations.push(conversation);
              conversation.messages.push(item);
              })
          }
        }
      });
    });
  }

  selectChatConversation(conversation:Conversation){
    this.chatConversation = conversation;
  }
}

