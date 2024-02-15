import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { PrincipalComponent } from './principal/principal.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NewComponent } from './new/new.component';
import { FormsModule } from '@angular/forms';
import { WarningComponent } from './warning/warning.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    PrincipalComponent,
    ProfileComponent,
    ContactsComponent,
    NewComponent,
    WarningComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    HttpClientModule
    
  ]
})
export class ChatModule { }
