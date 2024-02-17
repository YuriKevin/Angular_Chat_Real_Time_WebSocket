import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Message } from './message';
import { Contact } from './contact';
import { BehaviorSubject } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { User } from './user';
import { Router } from '@angular/router';
import { Conversation } from './conversation';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;
  private messageSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  private apiURL = "http://localhost:8080/";
  private user!:User;
  public contacts: Contact[] = [];
  private conversations:Conversation[] = [];

  constructor(private httpClient: HttpClient, private router:Router) {
    


  }

  login(telephone:number){
    this.loadUser(telephone).subscribe((data: User) => {
      this.user = data;
      console.log(this.user);
      this.loadContacts().subscribe((data: Contact[]) => {
      this.contacts = data;
      console.log(data);
      this.initConnectionSocket();
      this.joinRoom(this.user.telephone);
      this.router.navigate(['']);

    });
    });
  }

  initConnectionSocket(){
    const url = '//localhost:8080/chat-socket'
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  joinRoom(roomId: number){
    this.stompClient.connect({}, ()=>{
      this.stompClient.subscribe(`/topic/${roomId}`, (messages:any) =>{
        const messageContent = JSON.parse(messages.body);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);
        this.messageSubject.next(currentMessage);
      })
    })
  }

    sendMessage(roomId: number, message:Message){
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(message))
    }

    getMessageSubject(){
      return this.messageSubject.asObservable();
    }

   

    httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    }
    
    loadUser(telephone:number): Observable<any> {
      return this.httpClient.get(this.apiURL + 'user/' + telephone)
      .pipe(
        catchError(this.errorHandler)
      )
    }

    loadContacts(): Observable<any> {
    return this.httpClient.get<Contact[]>(this.apiURL + 'contact/' + this.user.telephone)
        .pipe(
            catchError(this.errorHandler)
        );
    }
    errorHandler(error:any) {
      let errorMessage = '';
      if(error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(errorMessage);
    }

    getUser(){
      return this.user;
    }
    getContacts(){
      return this.contacts;
    }
    getContact(id:number):Contact| undefined {
      return this.contacts.find(contact => contact.id == id);
    }

    addContact(nickname: string, userAddedId: number): Observable<any> {
      const userId = this.user.telephone;
      return this.httpClient.post<any>(this.apiURL + 'contact', { userId, userAddedId, nickname });
    }

    addContactInArray(contact:Contact){
      this.contacts.push(contact);
    }

    deleteContact(id: number): Observable<any> {
      return this.httpClient.delete(this.apiURL + 'contact/' + id)
        .pipe(
            catchError(this.errorHandler)
        );
    }

    deleteContactinArray(id:number){
      const index = this.contacts.findIndex(contact => contact.id === id);

      if (index !== -1) {
        this.contacts.splice(index, 1);
      }
    }

    anonymousContact(anonymousTelephone: number): Observable<any> {
      return this.httpClient.get<Contact>(this.apiURL + 'contact/anonymous/' + anonymousTelephone)
        .pipe(
            catchError(this.errorHandler)
        );
    }

}

