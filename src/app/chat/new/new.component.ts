import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Contact } from '../contact';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['../principal/principal.component.css','./new.component.css']
})
export class NewComponent implements OnInit{
  nickname!:string;
  telephone!:number;
  contacts!:Contact[];
  user!:User;
  idRoute!:number;

  constructor(private chatService:ChatService, private route: ActivatedRoute){
    
  }

  ngOnInit(): void {
      this.idRoute = this.route.snapshot.params['id'];
      if(this.idRoute){
        this.telephone=this.idRoute;
      }
      this.contacts = this.chatService.getContacts();
      this.chatService.getUser();
  }

  addContact(): void {
      const indexContact = this.contacts.findIndex(contact => contact.telephone == this.telephone);
      if(indexContact == -1){
      this.chatService.addContact(this.nickname, this.telephone).subscribe({
        next: (contact: Contact) => {
          this.chatService.addContactInArray(contact, false);
        },
        error: (error) => {
          console.error('Erro ao adicionar contato:', error);
          
        }
      });
    }
    else if(this.telephone == this.user.telephone){
      console.log("você não pode adicionar a si mesmo.");
    }
    else{
      console.log("o contato já existe na sua agenda ("+this.contacts[indexContact].nickname+").");
    }
  }
}
