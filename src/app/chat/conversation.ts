import { Contact } from "./contact";
import { Message } from "./message";

export interface Conversation{
    contact: Contact;
    messages: Message[];
    lastMessage:string;
    viewed:boolean;
}