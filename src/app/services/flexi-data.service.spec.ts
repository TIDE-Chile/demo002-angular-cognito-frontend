import { TestBed, inject } from '@angular/core/testing';

import { FlexiDataService } from './flexi-data.service';

describe('FlexiDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlexiDataService]
    });
  });

  it('should be created', inject([FlexiDataService], (service: FlexiDataService) => {
    expect(service).toBeTruthy();
  }));
});
