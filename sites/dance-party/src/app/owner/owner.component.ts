import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify/spotify.service';
import { UserInfo } from '../spotify/user-info.model';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.less']
})
export class OwnerComponent implements OnInit {
  userData: UserInfo;
  imageUrl: String;
  queryString: String = '';

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.spotifyService.getUserInfo().subscribe(x => {
      this.userData = x
    }, err => {
      if (err.status == 401) {
        this.spotifyService.logout();
      }
    });
  }

  search() {
    console.log(this.queryString);
    this.spotifyService.search(this.queryString).subscribe(x => console.log(x))
  }

}
