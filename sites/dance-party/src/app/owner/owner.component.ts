import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify/spotify.service';
import { UserInfo } from '../spotify/user-info.model';
import { GatewayService } from '../aws-gateway/gateway.service';
import * as qrcode from 'qrcode';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  userData: UserInfo;
  imageUrl: String;
  queryString: String = '';
  currentSong;
  queue = [];

  constructor(private spotifyService: SpotifyService, private gatewayService: GatewayService) { }

  ngOnInit(): void {
    this.spotifyService.getUserInfo().subscribe(x => {
      this.userData = x
      this.gatewayService.createParty(x.email);
      qrcode.toDataURL('https://dev.rossreicks.com/herb-prices', (err, url) => {
        this.imageUrl = url;
      });
      this.search();
    }, err => {
      if (err.status == 401) {
        this.spotifyService.logout();
      }
    });
  }

  search() {
    this.queryString = 'old town road';
    this.spotifyService.search(this.queryString).subscribe(x => this.createQueue(x))
  }

  createQueue(searchResults) {
    searchResults.tracks.items.forEach(track => {
      this.queue.push({ name: track.name, artist: track.artists[0].name, artwork: track.album.images[2].url })
    })

    this.queue = this.queue.slice(1, 7);
  }

}
