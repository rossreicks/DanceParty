import { Injectable } from "@angular/core";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class GatewayService {
    socket: WebSocketSubject<any> = webSocket(environment.ws);

    searchSong(trackId: String) {
        this.socket.next({action: 'queueSong', trackId});
    }

    createParty(emailAddress: String) {
        this.socket.subscribe(msg => console.log('message received: ' + msg), err => console.error(err), () => console.log('connection closed'));
        this.socket.next({action: 'createParty', emailAddress});
    }
}
