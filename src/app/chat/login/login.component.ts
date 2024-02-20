import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { WarningComponent } from '../warning/warning.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../principal/principal.component.css','./login.component.css']
})
export class LoginComponent{
    telephone!:number;
    password!:string;
    @ViewChild(WarningComponent) warningComponent!: WarningComponent;

    constructor(private chatService:ChatService, private router: Router, private cdr: ChangeDetectorRef){

    }

    ngAfterViewInit(): void {
      setTimeout(() => {
        const currentRoute = this.router.url;
        if (currentRoute === '/login/success' && this.warningComponent) {
          this.warningComponent.updateValues('Seu cadastro foi realizado com sucesso! Você já pode realizar seu login.', false, false, true, false);
          // prevenir o erro NG0100 que ocorre quando uma propriedade de um componente é atualizada após a detecção de alterações ter sido concluída
          this.cdr.detectChanges();
        }
      });
    }

    login() {
      if(!this.telephone){
        this.warningComponent.updateValues('Digite o telefone.', true, false, false, false);
      }
      const numberString: string = this.telephone.toString();
      if (numberString.length !== 11) {
        this.warningComponent.updateValues('O número precisa ter 11 dígitos', false, false, true, false);
        return;
      }
      else if(!this.password || this.password.length==0){
        this.warningComponent.updateValues('Digite a senha', false, false, true, false);
      }
      this.warningComponent.updateValues('Aguarde enquanto validamos seus dados.', true, false, false, false);
      this.chatService.login(this.telephone, this.password).subscribe({
        next: () => {
          
        },
        error: (error) => {
          this.warningComponent.updateValues(error, false, false, true, false);
        }
      });
    }
}