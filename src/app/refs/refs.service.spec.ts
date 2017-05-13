import { TestBed, inject } from '@angular/core/testing';

import { RefsService } from './refs.service';

describe('RefsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefsService]
    });
  });

  it('should be created', inject([RefsService], (service: RefsService) => {
    expect(service).toBeTruthy();
  }));
});
