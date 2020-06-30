import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Track } from "../track/track.component";


@Injectable({
    providedIn: 'root'
})
export class GatewayService {
    socket: WebSocketSubject<any> = webSocket(environment.ws);

    searchSong(query: String): Promise<Track[]> {
        return new Promise((resolve, reject) => {
            this.socket.subscribe(x => {
                const tracks: Track[] = [];
                x.forEach(track => {
                    tracks.push({
                        artist: track.artists[0].name,
                        artwork: track.album.images[2].url,
                        name: track.name,
                        uri: track.uri
                    })
                });
                resolve(tracks);
            }, reject, () => console.log('connection closed'));
            this.socket.next({ action: 'search', query });
        })

    }

    createParty(partyId: Number): Observable<any> {
        this.socket.next({ action: 'createparty', partyId: partyId.toString() });
        return this.socket.asObservable();
    }

    queueSong(partyId: Number, trackUri: String) {
        this.socket.next({ action: 'queuesong', partyId: partyId.toString(), trackUri: trackUri })
    }
}
