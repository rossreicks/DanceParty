import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GatewayService } from '../aws-gateway/gateway.service';
import { Track } from '../track/track.component';
import { timeout, take, debounce, map, debounceTime } from 'rxjs/operators';
import { interval, Observable, Subscription, Subject, empty } from 'rxjs';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  query: String = '';
  partyId: number;
  tracks: Observable<Track[]>;
  showAlert: boolean = false;
  alertInterval: any;
  searchSubject = new Subject();

  constructor(private route: ActivatedRoute, private gatewayService: GatewayService) { }

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe(params => {
      this.partyId = +params['party_id'];
      if (!this.partyId) {
        console.error('whoops') // redirect to party not found page
      }
    });
    this.searchSubject.pipe(debounceTime(400)).subscribe(() => this.search())

  }

  search() {
    this.tracks = this.gatewayService.searchSong(this.query)
  }

  searchKey() {
    this.searchSubject.next()
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.alertInterval) {
      this.alertInterval.unsubscribe();
    }
  }

  queueSong(track: Track) {
    this.query = '';
    this.gatewayService.queueSong(this.partyId, track);
    this.tracks = empty();
    this.showAlert = true;

    this.alertInterval = interval(2000).pipe(timeout(2100)).pipe(take(1)).subscribe(() => this.showAlert = false)
  }

}
