import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { PrincipalComponent } from './principal/principal.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    PrincipalComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
