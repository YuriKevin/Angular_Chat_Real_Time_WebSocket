import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './chat/principal/principal.component';
import { ProfileComponent } from './chat/profile/profile.component';
import { ContactsComponent } from './chat/contacts/contacts.component';
import { NewComponent } from './chat/new/new.component';
import { LoginComponent } from './chat/login/login.component';
import { WarningComponent } from './chat/warning/warning.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent},
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'contacts', component: ContactsComponent},
  { path: 'new', component: NewComponent},
  { path: 'login', component: LoginComponent},
  { path: 'warning', component: WarningComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
