import { Contact } from "./contact";

export interface User{
    telephone:number;
    name: string;
    password: string;
    photo: string;
    status: string;
    contacts: Contact[];
}