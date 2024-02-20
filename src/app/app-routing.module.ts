import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './chat/principal/principal.component';
import { ProfileComponent } from './chat/profile/profile.component';
import { ContactsComponent } from './chat/contacts/contacts.component';
import { NewComponent } from './chat/new/new.component';
import { LoginComponent } from './chat/login/login.component';
import { WarningComponent } from './chat/warning/warning.component';
import { SignUpComponent } from './chat/sign-up/sign-up.component';
import { EditProfileComponent } from './chat/edit-profile/edit-profile.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent},
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'contacts', component: ContactsComponent},
  { path: 'new', component: NewComponent},
  { path: 'new/:id', component: NewComponent },
  { path: 'login', component: LoginComponent},
  { path: 'warning', component: WarningComponent},
  { path: 'login/success', component: LoginComponent},
  { path: 'signUp', component: SignUpComponent},
  { path: 'edit-profile', component: EditProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
