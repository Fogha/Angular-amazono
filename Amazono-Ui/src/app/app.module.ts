import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap/';
import { HomeComponent } from './Components/home/home.component';
import { RestApiService } from './Services/rest-api.service';
import { MessageComponent } from './Components/message/message.component';
import { DataService } from './Services/data.service';

@NgModule({
  declarations: [AppComponent, HomeComponent, MessageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [RestApiService, DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
