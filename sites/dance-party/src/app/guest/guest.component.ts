import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GatewayService } from '../aws-gateway/gateway.service';
import { Track } from '../track/track.component';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements OnInit, OnDestroy {
  private sub: any;
  query: String = '';
  partyId: number;
  tracks: Track[] = [];

  constructor(private route: ActivatedRoute, private gatewayService: GatewayService) { }

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe(params => {
      console.log(params);
      this.partyId = +params['party_id'];
      if (!this.partyId) {
        console.error('whoops') // redirect to party not found page
      }
    });
  }

  search() {
    this.gatewayService.searchSong(this.query).then(x => {
      this.tracks = x.splice(1, 7);
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  queueSong(track: Track) {
    this.gatewayService.queueSong(this.partyId, track.uri);
  }

}
