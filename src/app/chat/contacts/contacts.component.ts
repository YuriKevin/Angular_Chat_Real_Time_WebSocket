import { Component, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Contact } from '../contact';
import { Router } from '@angular/router';
import { User } from '../user';
import { WarningComponent } from '../warning/warning.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['../principal/principal.component.css','./contacts.component.css']
})
export class ContactsComponent {
  contacts:Contact[] = [];
  text:string = '';
  searchResults: Contact[] = [];
  user!:User;
  @ViewChild(WarningComponent) warningComponent!: WarningComponent;


  constructor(private chatService:ChatService, private router:Router){

  }

  ngOnInit(): void {
    if(!this.user){//primeiro if pra quando o ngOnInit for iniciado pela segunda ou demais vezes
      this.user = this.chatService.getUser();
      if(!this.user){
        this.router.navigate(['/login']);
      }
    }
    this.contacts = this.chatService.getContacts(); 
    this.searchResults = this.contacts;
  }

  search(): void {
    this.searchResults = this.contacts.filter(contact => 
      contact.nickname.toLowerCase().includes(this.text.toLowerCase())
    );
  }

  confirmDelete(id: number): void {
    this.warningComponent.updateValues("Tem certeza que deseja excluir este contato?", false, true, false, false);
    this.warningComponent.confirmAction.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteContact(id);
      } else {
        this.warningComponent.close();
      }
    });
  }

  deleteContact(id: number): void {
    this.warningComponent.updateValues("Excluindo contato.", true, false, false, false);
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
        this.warningComponent.updateValues(error, false, true, false, false);
      }
    });
  }

  editContact(contact:Contact){
    const mensagem = "Digite o novo nome do contato "+ contact.nickname+": ";
    this.warningComponent.updateValues(mensagem, false, false, false, true);
    this.warningComponent.textOutput.subscribe((text: string) => {
        this.chatService.editContact(contact).subscribe({
          next: () => {
              this.warningComponent.updateValues('Contato editado com sucesso', false, false, true, false);
              contact.nickname = text;
            },
          error: (error) => {
            console.log(error);
            if(error==204){
              this.warningComponent.updateValues('Contato editado com sucesso', false, false, true, false);
              contact.nickname = text;
            }
            else{
              this.warningComponent.updateValues('Ocorreu um erro com o servidor.', false, false, true, false);
            }
          }
        });
      });
  }

}
