import { Component, OnInit } from '@angular/core';
import {RefsService} from './refs.service';

@Component({
  selector: 'app-refs',
  templateUrl: './refs.component.html',
  styleUrls: ['./refs.component.scss']
})
export class RefsComponent implements OnInit {

  constructor(
    private refService: RefsService
  ) { }

  ngOnInit() {
  }

  public downloadFile (resourceUrl: string) {
    this.refService.downloadFile(resourceUrl)
      .subscribe(data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  }
}
