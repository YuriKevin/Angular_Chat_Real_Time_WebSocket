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
  private contacts: Contact[] = [];
  private conversations:Conversation[] = [];
  private chatConversation!:Conversation;
  private idLastMessgeUser!:number;


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
        this.messageSubject.next(messageContent);
      })
    })
  }

    sendMessage(roomId: number, text:string){
      const message = {
        message: text,
        user: this.user.telephone
      } as Message
      this.chatConversation.messages.push(message);
      this.chatConversation.lastMessage = message.message;
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(message))
      if(roomId !== this.idLastMessgeUser){
        const index = this.conversations.findIndex(conv => conv.contact.telephone === roomId);
        const conversation = this.conversations.splice(index, 1)[0];
        this.conversations.unshift(conversation);
        this.idLastMessgeUser = roomId;
      }
    }

    getMessageSubject(){
      return this.messageSubject.asObservable();
    }

    receivedMessage(){
      this.getMessageSubject().subscribe((message: any) => {
        console.log(message);
        if(this.chatConversation && message.user == this.chatConversation.contact.telephone){
          this.chatConversation.messages.push(message);
          this.chatConversation.lastMessage = message.message;
        }
        else{
        const index = this.conversations.findIndex(conv => conv.contact.telephone === message.user);
            if(index != -1) {
              const conversation = this.conversations.splice(index, 1)[0];
              conversation.messages.push(message);
              conversation.lastMessage = message.message;
              this.conversations.unshift(conversation);
            }
            else{
              this.anonymousContact(message.user).subscribe((data: Contact)=>{
                this.addContactInArray(data, true);
                const conversation: Conversation = {
                  contact: data,
                  messages: [message], 
                  lastMessage: message.message
                }
                this.conversations.push(conversation);
                //conversation.messages.push(message);
                //conversation.lastMessage = message.message;
                })
            }
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
    getContact(telephone:number):Contact| undefined {
      return this.contacts.find(contact => contact.telephone == telephone);
    }

    getConversations(){
      return this.conversations
    }

    addContact(nickname: string, userAddedId: number): Observable<any> {
      const userId = this.user.telephone;
      return this.httpClient.post<any>(this.apiURL + 'contact', { userId, userAddedId, nickname });
    }

    addContactInArray(contact:Contact,anonymous:boolean){
      if(!this.contacts){
        this.contacts = [];
      }
      if(anonymous==false){
      this.contacts.push(contact);
      const conversation: Conversation = {
        contact: contact,
        messages: [], 
        lastMessage: ''
      }
        this.conversations.push(conversation);
      }
      else{
        this.contacts.push(contact);
      }
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

    selectChatConversation(conversation:Conversation){
      this.chatConversation = conversation;
    }
    getChatConversation(){
      return this.chatConversation;
    }

}

