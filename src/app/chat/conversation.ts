import { Message } from "./message";

export interface Conversation{
    id:number;
    userId1: number;
    userId2: number;
    messages: Message[];
}