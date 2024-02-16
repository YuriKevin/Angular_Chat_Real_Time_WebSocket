import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
import { Contact } from '../contact';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['../principal/principal.component.css','./contacts.component.css']
})
export class ContactsComponent {
  contacts:Contact[] = [];
  text:string = '';
  searchResults: Contact[] = [];

  constructor(private chatService:ChatService){

  }

  ngOnInit(): void {
    this.contacts = this.chatService.getContacts(); 
    this.searchResults = this.contacts;
  }

  search(): void {
    this.searchResults = this.contacts.filter(contact => 
      contact.nickname.toLowerCase().includes(this.text.toLowerCase())
    );
  }

  deleteContact(id: number): void {
    this.chatService.deleteContact(id).subscribe({
      next: () => {
        console.log('Contato excluído com sucesso!');
        this.chatService.deleteContactinArray(id);
        const index = this.contacts.findIndex(contact => contact.id === id);

        if (index !== -1) {
          this.contacts.splice(index, 1);
        }

        
      },
      error: (error) => {
        console.error('Erro ao excluir contato:', error);
      }
    });
  }

}
