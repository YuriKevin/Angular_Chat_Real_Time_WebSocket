import { Component, OnInit, ViewChild } from '@angular/core';
import { WarningComponent } from '../warning/warning.component';
import { User } from '../user';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['../principal/principal.component.css','../profile/profile.component.css','./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit{
  photo: string = "../../../assets/images/user.png";
  name!:string;
  status:string = "Olá! Estou usando Texter!";
  user!:User;
  @ViewChild(WarningComponent) warningComponent!: WarningComponent;

  //armazenas variáveis para segurança caso a atualização dê errado:
  secureName!:string;
  secureStatus:string = "Olá! Estou usando Texter!";
  securePhoto!:string;

  constructor(private chatService:ChatService){

  }

  ngOnInit(): void {
      this.user = this.chatService.getUser();
      if(this.user){
      if(this.user.photo){
        this.photo = this.user.photo;
      }
      if(this.user.status){
        this.status = this.user.status;
      }
      this.name = this.user.name;
    }
    this.secureName = this.name;
    this.securePhoto = this.photo;
    this.secureStatus = this.status;
  }

  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isImageFile(file)) {
        this.readFileAsBase64(file);
      } else {
        this.warningComponent.updateValues("O arquivo selecionado não é uma imagem.", false, false, true, false);
      }
    }
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  readFileAsBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.photo = reader.result as string;
      console.log(this.photo);
    };
    reader.readAsDataURL(file);
  }

  editUser(){
    this.user.name = this.name;
    this.user.photo = this.photo;
    this.user.status = this.status;
    this.warningComponent.updateValues('Aguarde enquanto validamos seus dados.', true, false, false, false);
    this.chatService.editUser(this.user).subscribe({
      next: () => {
          this.warningComponent.updateValues('Dados atualizados com sucesso', false, false, true, false);
        },
      error: (error) => {
        if(error==204){
          this.warningComponent.updateValues('Dados atualizados com sucesso', false, false, true, false);
        }
        else{
          this.warningComponent.updateValues('Ocorreu um erro com o servidor.', false, false, true, false);
          this.user.name = this.secureName;
          this.user.photo = this.securePhoto;
          this.user.status = this.secureStatus;
        }
      }
    });
  };
}


