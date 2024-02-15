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

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;
  private messageSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  private apiURL = "http://localhost:8080/";
  private user!:User;
  public contacts: Contact[] = [];

  constructor(private httpClient: HttpClient) {
    this.initConnectionSocket();

    this.loadUser(44444444444).subscribe((data: User) => {
      this.user = data;
      console.log(this.user);
      this.loadContacts().subscribe((data: Contact[]) => {
      this.contacts = data;
      console.log(data);
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

}

