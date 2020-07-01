import { Routes, CanActivate } from '@angular/router';
import {
    AuthGuardService as AuthGuard
} from './auth/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { GuestComponent } from './guest/guest.component';
import { PartyComponent } from './party/party.component';

export const ROUTES: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'party',
        component: PartyComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'guest',
        component: GuestComponent
    },
    { path: '**', redirectTo: '' }
];