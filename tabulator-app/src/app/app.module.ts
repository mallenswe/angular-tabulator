
// Modules
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';


// Components
import { AppComponent } from './app.component';
import { TabulatorComponent } from './tabulator/tabulator.component';

@NgModule({
  declarations: [
    AppComponent,
    TabulatorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
