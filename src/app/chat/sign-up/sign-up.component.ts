import { Component, ViewChild } from '@angular/core';
import { WarningComponent } from '../warning/warning.component';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../principal/principal.component.css','../login/login.component.css','./sign-up.component.css']
})
export class SignUpComponent {
  telephone!:number;
  password!:string;
  password2!:string;
  name!:string;
  @ViewChild(WarningComponent) warningComponent!: WarningComponent;

  constructor(private charService:ChatService, private router:Router){

  }

  signUp(){
    
      if(!this.telephone || !this.password || !this.password2 ||!this.name){
        this.warningComponent.updateValues('Preenchas todos os campos.', false, false, true, false);
        return;
      }
      const numberString: string = this.telephone.toString();
      if (numberString.length !== 11) {
        this.warningComponent.updateValues('O número precisa ter 11 dígitos.', false, false, true, false);
        return;
      }
      else if(this.password != this.password2){
        this.warningComponent.updateValues('As senhas não coincidem.', false, false, true, false);
        return;
      }
      else if(this.password.length<=7){
        this.warningComponent.updateValues('Digite uma senha maior que 7 caracteres.', false, false, true, false);
        return;
      }
      else if(this.name.length==0 || this.name.length>20){
        this.warningComponent.updateValues('O nome precisa ter entre 1 e 20 caracteres.', false, false, true, false);
        return;
      }
      this.warningComponent.updateValues('Aguarde enquanto validamos seus dados.', true, false, false, false);
      this.charService.signUp(this.telephone, this.password, this.name).subscribe({
          next: () => {
            this.router.navigate(['/login/success']);
          },
          error: (error) => {
            this.warningComponent.updateValues(error, false, false, true, false);
          }
        });
  }
}
