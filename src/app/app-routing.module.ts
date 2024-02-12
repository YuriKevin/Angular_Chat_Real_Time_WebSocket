import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './chat/principal/principal.component';
import { ProfileComponent } from './chat/profile/profile.component';
import { ContactsComponent } from './chat/contacts/contacts.component';
import { NewComponent } from './chat/new/new.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'contacts', component: ContactsComponent},
  { path: 'new', component: NewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
