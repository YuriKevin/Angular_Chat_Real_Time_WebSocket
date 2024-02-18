import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { User } from '../user';
import { Contact } from '../contact';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../principal/principal.component.css','./profile.component.css']
})
export class ProfileComponent implements OnInit {
  id!: number;
  user!:User;
  contact!:Contact | undefined;
  userProfile:boolean = true;
  contactProfile:boolean = false;

  constructor(private route: ActivatedRoute, private chatService:ChatService, private router:Router) { 
    
  }

  ngOnInit(): void {
    this.user = this.chatService.getUser();
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.userProfile = false;
      this.contactProfile = true;
      this.contact = this.chatService.getContact(this.id);
      
      if(this.contact == undefined){
          this.router.navigate(['/profile']);
      }
    }
  }
}
