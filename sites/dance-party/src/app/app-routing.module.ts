import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { ROUTES } from './app.routes';

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }