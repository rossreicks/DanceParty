import { Component, OnInit, Input } from '@angular/core';

export interface Track {
  artist: String;
  artwork: String;
  name: String;
  uri: String;
}

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {
  @Input()
  track: Track

  constructor() { }

  ngOnInit(): void {
  }

}
