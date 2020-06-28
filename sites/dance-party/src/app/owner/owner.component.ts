import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify/spotify.service';
import { UserInfo } from '../spotify/user-info.model';
import { GatewayService } from '../aws-gateway/gateway.service';
import * as qrcode from 'qrcode';
import { Track } from '../track/track.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  userData: UserInfo;
  imageUrl: String;
  queryString: String = '';
  currentSong: Track;
  queue: Track[] = [];

  constructor(private spotifyService: SpotifyService, private gatewayService: GatewayService) { }

  ngOnInit(): void {
    this.spotifyService.getUserInfo().subscribe(x => {
      this.userData = x
      this.gatewayService.createParty(x.email);
      const url = environment.guest_url + '?party_id=' + this.generateHash(this.userData.email);
      console.log(url);
      qrcode.toDataURL(url, (err, url) => {
        this.imageUrl = url;
      });
      this.search();
      this.spotifyService.getCurrentPlaying().subscribe(x => {
        if (x && x['currently_playing_type']) {
          this.currentSong = {
            artist: x.item.artists[0].name,
            artwork: x.item.album.images[2].url,
            name: x.item.name,
            uri: x.item.uri
          }
        }
      })
      //this.spotifyService.addSongToQueue("spotify:track:2YpeDb67231RjR0MgVLzsG").subscribe(console.log)
    }, err => {
      if (err.status == 401) {
        this.spotifyService.logout();
      }
    });
  }

  generateHash(str: String) {
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

  search() {
    this.queryString = 'old town road';
    this.spotifyService.search(this.queryString).subscribe(x => this.createQueue(x))
  }

  createQueue(searchResults) {
    searchResults.tracks.items.forEach(track => {
      this.queue.push({ name: track.name, artist: track.artists[0].name, artwork: track.album.images[2].url, uri: track.uri })
    })

    this.queue = this.queue.slice(1, 7);
  }

}
