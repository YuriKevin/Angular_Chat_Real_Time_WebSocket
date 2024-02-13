import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { PrincipalComponent } from './principal/principal.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NewComponent } from './new/new.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PrincipalComponent,
    ProfileComponent,
    ContactsComponent,
    NewComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule
    
  ]
})
export class ChatModule { }
