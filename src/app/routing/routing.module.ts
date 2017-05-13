import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../home/home.component';
import {DemosComponent} from '../demos/demos.component';
import {MTFComponent} from '../mtf/mtf.component';
import {NGComponent} from '../ng/ng.component';
import {ContentComponent} from '../content/content.component';
import {RefsComponent} from '../refs/refs.component';
import {BiosComponent} from '../bios/bios.component';
import {SaComponent} from '../sa/sa.component';

export const appRoutes: Routes = [
  { path: 'refs', component: RefsComponent },
  { path: 'bios', component: BiosComponent },
  { path: 'demos', component: DemosComponent, children: [
    {
      path: 'mtf',
      component: MTFComponent
    },
    {
      path: 'ng',
      component: NGComponent
    },
    {
      path: 'sa',
      component: SaComponent
    }
  ]},
  { path: '', component: HomeComponent, children: [
    {
      path: 'section',
      children: [{
        path: ':id/:sub',
        component: ContentComponent
      }]
    }
  ] },
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class RoutingModule { }
