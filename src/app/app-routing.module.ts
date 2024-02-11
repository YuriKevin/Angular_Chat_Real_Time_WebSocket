import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './chat/principal/principal.component';
import { ProfileComponent } from './chat/profile/profile.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent},
  { path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
