import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { OwnerComponent } from './owner/owner.component';
import { AppRoutingModule } from './app-routing.module';
import { TrackComponent } from './track/track.component';
import { GuestComponent } from './guest/guest.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OwnerComponent,
    TrackComponent,
    GuestComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
