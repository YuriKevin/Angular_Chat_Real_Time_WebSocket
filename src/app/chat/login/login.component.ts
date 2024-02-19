import { Component, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { WarningComponent } from '../warning/warning.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../principal/principal.component.css','./login.component.css']
})
export class LoginComponent {
    telephone!:number;
    password!:string;
    @ViewChild(WarningComponent) warningComponent!: WarningComponent;

    constructor(private chatService:ChatService){

    }

    login() {
      const numberString: string = this.telephone.toString();
      if (numberString.length !== 11) {
        this.warningComponent.updateValues('O número precisa ter 11 dígitos', false, false, true, false);
        return;
      }
      this.chatService.login(this.telephone, this.password).subscribe({
        next: () => {
          
        },
        error: (error) => {
          this.warningComponent.updateValues(error, false, false, true, false);
        }
      });
    }
}