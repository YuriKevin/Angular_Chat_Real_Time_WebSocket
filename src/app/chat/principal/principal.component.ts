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
  mobile:boolean = false;
  desktop:boolean = true;

  //para dispositivos móveis
  chatVisibility:boolean = false;


  constructor(private chatService:ChatService, private router:Router){

  }

  ngOnInit(): void {
    this.screenSize();
    if(!this.user){//primeiro if pra quando o ngOnInit for iniciado pela segunda ou demais vezes
      this.user = this.chatService.getUser();
      if(!this.user){
        this.router.navigate(['/login']);
      }
    }
      this.contacts = this.chatService.getContacts();
      this.conversations = this.chatService.getConversations();
      if(!this.chatConversation){
        this.chatConversation = this.chatService.getChatConversation();
      }
      this.chatConversation = this.conversations[0];
  }

  ngOnDestroy(): void {
    this.contacts = [];
    this.conversations = [];
  }

  sendMessage(friendTelephone:number){
    this.text = this.text.replace(/\n/g, '');
    this.chatService.sendMessage(friendTelephone, this.text);
    this.text = '';
  }

  selectChatConversation(conversation:Conversation){
    this.chatConversation = conversation;
    this.chatService.selectChatConversation(conversation);
  }

  screenSize() {
    const larguraDaTela = window.innerWidth;
    if (larguraDaTela < 745) {
      this.mobile = true;
      this.desktop = false
    }
    console.log(this.mobile);
  }
  changeToChat(){
    if(this.mobile){
      if(this.chatVisibility==true)
      {
        this.chatVisibility=false;
      }
      else{
        this.chatVisibility=true
      }
    }
  }

}

