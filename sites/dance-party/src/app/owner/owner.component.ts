import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpotifyService } from '../spotify/spotify.service';
import { UserInfo } from '../spotify/user-info.model';
import { GatewayService, Party } from '../aws-gateway/gateway.service';
import * as qrcode from 'qrcode';
import { Track } from '../track/track.component';
import { environment } from '../../environments/environment';
import { interval } from 'rxjs';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit, OnDestroy {
  userData: UserInfo;
  guestUrl: String;
  imageUrl: String;
  queryString: String = '';
  currentSong: Track;
  queue: Track[] = [];
  party: Party
  intervalSubscription: any;
  queueSyncInterval: any;
  partyName: String = 'Party Name Here';

  constructor(private spotifyService: SpotifyService, private gatewayService: GatewayService) { }

  ngOnInit(): void {
    this.spotifyService.getUserInfo().subscribe(x => {
      this.userData = x
      this.partyName = x.email.split('@')[0] + "'s party";
      this.gatewayService.createParty(this.generateHash(this.userData.email), this.partyName).then(x => {
        this.party = x;
        this.queue = this.party.queue;
        this.partyName = this.partyName;
      })
      this.gatewayService.getMessageQueue().subscribe(x => {
        if (x && x.track) {
          const track = x.track as Track
          if (!this.queue.map(x => x.uri).includes(track.uri)) {
            this.spotifyService.addSongToQueue(track.uri).subscribe(y => {
              this.queue.push(track)
              this.syncQueue()
            });
          }
        }
      })
      this.guestUrl = environment.guest_url + '?party_id=' + this.generateHash(this.userData.email);
      qrcode.toDataURL(this.guestUrl, (err, url) => {
        this.imageUrl = url;
      });
      this.fetchCurrentPlaying()

    }, err => {
      if (err.status == 401) {
        this.spotifyService.logout();
      }
    });
  }

  ngOnDestroy(): void {
    this.intervalSubscription.unsubscribe();
  }

  syncQueue() {
    if (this.queue.length > 0 && !!this.currentSong) {
      const queueUrls = this.queue.map(x => x.uri);
      if (queueUrls.includes(this.currentSong.uri)) {
        // remove all of the queue up until and including the current song
        for (let i = 0; i <= queueUrls.indexOf(this.currentSong.uri); i++) {
          this.queue.shift();
        }
      }
      this.gatewayService.syncQueue(this.party.partyId, this.queue);
    }
  }

  fetchCurrentPlaying() {
    const getCurrentPlaying = () => {
      this.spotifyService.getCurrentPlaying().subscribe(x => {
        if (x && x['currently_playing_type']) {
          if (!this.currentSong || this.currentSong.uri != x.item.uri) {
            this.currentSong = {
              artist: x.item.artists[0].name,
              artwork: x.item.album.images[2].url,
              name: x.item.name,
              uri: x.item.uri
            }
            this.syncQueue()
          }
        }
      })
    }
    getCurrentPlaying();
    this.intervalSubscription = interval(5000).subscribe(() => {
      getCurrentPlaying();
    });
  }

  generateHash(str: String): number {
    var hash = 0;
    if (str.length == 0) {
      return hash;
    }
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  createQueue(searchResults) {
    searchResults.tracks.items.forEach(track => {
      this.queue.push({ name: track.name, artist: track.artists[0].name, artwork: track.album.images[2].url, uri: track.uri })
    })

    this.queue = this.queue.slice(1, 7);
  }

}
