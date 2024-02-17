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
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PrincipalComponent,
    ProfileComponent,
    ContactsComponent,
    NewComponent,
    WarningComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule
    
  ]
})
export class ChatModule { }
