import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Contact } from '../contact';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
import { WarningComponent } from '../warning/warning.component';
import { Router } from '@angular/router';

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
  @ViewChild(WarningComponent) warningComponent!: WarningComponent;

  constructor(private chatService:ChatService, private route: ActivatedRoute, private router:Router){
    
  }

  ngOnInit(): void {
    if(!this.user){//primeiro if pra quando o ngOnInit for iniciado pela segunda ou demais vezes
      this.user = this.chatService.getUser();
      if(!this.user){
        this.router.navigate(['/login']);
      }
    }
      this.idRoute = this.route.snapshot.params['id'];
      if(this.idRoute){
        this.telephone=this.idRoute;
      }
      this.contacts = this.chatService.getContacts();
      
  }
  add(){
    this.warningComponent.updateValues("Adicionando contato.", true, false, false, false);
    this.chatService.addContact(this.nickname, this.telephone).subscribe({
      next: (contact: Contact) => {
        this.chatService.addContactInArray(contact, false);
        this.warningComponent.updateValues('Contato adicionado com sucesso', false, false, true, false);
        this.nickname = "";
        this.telephone = 0;
      },
      error: (error) => {
        this.warningComponent.updateValues(error, false, false, true, false);
      }
    });
  }

    addContact(): void {
      if(this.nickname.length===0){
        this.warningComponent.updateValues('Você precisa digitar um nome', false, false, true, false);
        return;
      }
      const numberString: string = this.telephone.toString();
      if (numberString.length !== 11) {
        this.warningComponent.updateValues('O número precisa ter 11 dígitos', false, false, true, false);
        return;
      }

      if(this.telephone == this.user.telephone){
        this.warningComponent.updateValues('você não pode adicionar a si mesmo', false, false, true, false);
      }
      else if(this.contacts == null){
        this.add();
      }
      else{
        const indexContact = this.contacts.findIndex(contact => contact.telephone == this.telephone);
        if(indexContact == -1){
          this.add();
        }
        else{
          if(this.contacts[indexContact].id==0){
            this.add();
          }
          else{
            this.warningComponent.updateValues('o contato já existe na sua agenda', false, false, true, false);
            }
        }
    }
  }
}
