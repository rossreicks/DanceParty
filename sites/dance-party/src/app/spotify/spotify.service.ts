import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserInfo } from './user-info.model';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private readonly stateKey = 'spotify_auth_state';
  private readonly client_id = 'c4a6147048f84df5b83b9e3034904753';
  //private readonly redirect_uri = environment.spotify_redirect_url;
  private readonly redirect_uri = window.location + 'party';
  private readonly spotify_access_token_id = 'spotify_access_token'

  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  public isAuthenticated(): boolean {
    const params = this.getHashParams();
    if (params.access_token) {
      this.parseQueryParams(params);
    }
    return !!this.getAccessToken();
  }

  public loginToSpotify(): void {
    const state = this.generateRandomString(16);

    localStorage.setItem(this.stateKey, state);
    const scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state';

    let url: string = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(this.client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(this.redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location = (url as unknown as Location);
  }

  public logout() {
    localStorage.removeItem(this.spotify_access_token_id);
    window.location = window.location.pathname as unknown as Location;
  }

  public getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>('https://api.spotify.com/v1/me', this.getHeader())
  }

  public addSongToQueue(trackUri: String) {
    return this.http.post('https://api.spotify.com/v1/me/player/queue?uri=' + trackUri, {}, this.getHeader())
  }

  public search(query: String) {
    return this.http.get('https://api.spotify.com/v1/search?type=track&q=' + query, this.getHeader());
  }

  public getCurrentPlaying(): Observable<any> {
    return this.http.get('https://api.spotify.com/v1/me/player/currently-playing?market=us', this.getHeader())
  }

  private getHeader() {
    return { headers: { 'Authorization': 'Bearer ' + this.getAccessToken() } };
  }

  private getAccessToken(): string {
    return localStorage.getItem(this.spotify_access_token_id);
  }

  private parseQueryParams(params): void {
    const access_token = params.access_token,
      state = params.state,
      storedState = localStorage.getItem(this.stateKey);

    if (access_token && (state == null || state !== storedState)) {
      alert('There was an error during the authentication');
      this.logout();
    } else {
      localStorage.removeItem(this.stateKey);
      if (access_token) {
        console.log(this.activatedRoute.url)
        localStorage.setItem(this.spotify_access_token_id, access_token);
        this.router.navigate(
          ['party'],
          {
            relativeTo: this.activatedRoute
          });
      }
    }
  }

  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  private generateRandomString(length): string {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  /**
  * Obtains parameters from the hash of the URL
  * @return Object
  */
  private getHashParams(): any {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
}
