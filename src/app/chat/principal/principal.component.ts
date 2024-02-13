import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Message } from '../message';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit{
  constructor(private chatService:ChatService){

  }

  ngOnInit(): void {
      this.chatService.joinRoom("ABC");
  }

  sendMessage(){
    const message = {
      message: 'hola',
      user:'1'
    } as Message
    this.chatService.sendMessage("ABC", message)
  }
}
