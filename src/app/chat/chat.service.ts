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
  //private messageSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  private messageSubject: BehaviorSubject<Message | null> = new BehaviorSubject<Message | null>(null);

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
      if(this.contacts){
        this.contacts.forEach(contact => {
          const conversation: Conversation = {
              contact: contact,
              messages: [], 
              lastMessage: ''
          };
          this.conversations.push(conversation);
        });
      }
      this.initConnectionSocket();
      this.joinRoom(this.user.telephone);
      this.receivedMessage();
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
        this.messageSubject.next(messageContent);
      })
    })
  }

    sendMessage(roomId: number, message:Message){
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(message))
    }

    getMessageSubject(){
      return this.messageSubject.asObservable();
    }

    receivedMessage(){
      this.getMessageSubject().subscribe((message: any) => {
            const conversation = this.conversations.find(conversation => conversation.contact.telephone == message.user);
            if (conversation) {
              conversation.messages.push(message);
              conversation.lastMessage = message.message;
            }
            else{
              this.anonymousContact(message.user).subscribe((data: Contact)=>{
                this.addContactInArray(data);
                const conversation: Conversation = {
                  contact: data,
                  messages: [], 
                  lastMessage: ''
                }
                this.conversations.push(conversation);
                conversation.messages.push(message);
                })
            }
      });
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
        )
        
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

    getConversations(){
      return this.conversations
    }

    addContact(nickname: string, userAddedId: number): Observable<any> {
      const userId = this.user.telephone;
      return this.httpClient.post<any>(this.apiURL + 'contact', { userId, userAddedId, nickname });
    }

    addContactInArray(contact:Contact){
      if(!this.contacts){
        this.contacts = [];
      }
      this.contacts.push(contact);
      const conversation: Conversation = {
        contact: contact,
        messages: [], 
        lastMessage: ''
      }
      this.conversations.push(conversation);
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

      const indexConversation = this.conversations.findIndex(conversation => conversation.contact.telephone === id);

      if (indexConversation !== -1) {
        this.contacts.splice(indexConversation, 1);
      }

    }

    anonymousContact(anonymousTelephone: number): Observable<any> {
      return this.httpClient.get<Contact>(this.apiURL + 'contact/anonymous/' + anonymousTelephone)
        .pipe(
            catchError(this.errorHandler)
        );
    }

}

