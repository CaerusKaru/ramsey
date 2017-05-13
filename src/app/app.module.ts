import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import 'hammerjs';
import 'd3';
import {RoutingModule} from './routing/routing.module';
import { DemosComponent } from './demos/demos.component';
import { HomeComponent } from './home/home.component';
import {MaterialModule} from './material/material.module';
import {NavMenuModule} from './nav-menu/index';
import { MTFComponent } from './mtf/mtf.component';
import { NGComponent } from './ng/ng.component';
import { ContentComponent, SnippetComponent } from './content/content.component';
import {ContentService} from './content/content.service';
import { RefsComponent } from './refs/refs.component';
import { BiosComponent } from './bios/bios.component';
import {PdfViewerComponent} from 'ng2-pdf-viewer';
import { SaComponent } from './sa/sa.component';
import {RefsService} from './refs/refs.service';

@NgModule({
  declarations: [
    AppComponent,
    DemosComponent,
    HomeComponent,
    MTFComponent,
    NGComponent,
    ContentComponent,
    SnippetComponent,
    RefsComponent,
    BiosComponent,
    PdfViewerComponent,
    SaComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    MaterialModule,
    RoutingModule,
    NavMenuModule
  ],
  providers: [ContentService, RefsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
