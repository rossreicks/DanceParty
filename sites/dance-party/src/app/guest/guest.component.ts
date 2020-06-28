import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements OnInit, OnDestroy {
  private sub: any;
  partyId: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe(params => {
      console.log(params);
      this.partyId = +params['party_id'];
      if (!this.partyId) {
        console.error('whoops') // redirect to party not found page
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
