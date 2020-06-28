import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SpotifyService } from '../spotify/spotify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public spotifyService: SpotifyService, public router: Router) {}
  canActivate(): boolean {
    if (!this.spotifyService.isAuthenticated()) {
      this.spotifyService.loginToSpotify();
      return false;
    }
    return true;
  }
}
