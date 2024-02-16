import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../principal/principal.component.css','./login.component.css']
})
export class LoginComponent {
    telephone!:number

    constructor(private chatService:ChatService){

    }

    login(){
      this.chatService.login(this.telephone);
    }

}
