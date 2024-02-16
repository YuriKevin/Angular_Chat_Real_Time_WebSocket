import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
import { Contact } from '../contact';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['../principal/principal.component.css','./new.component.css']
})
export class NewComponent {
  nickname!:string;
  telephone!:number;

  constructor(private chatService:ChatService){
    
  }

  addContact(): void {
    this.chatService.addContact(this.nickname, this.telephone).subscribe({
      next: (contact: Contact) => {
        console.log('Contato adicionado com sucesso!');
        this.chatService.addContactInArray(contact);
      },
      error: (error) => {
        console.error('Erro ao adicionar contato:', error);
        
      }
    });
  }
}
