import { TestBed } from '@angular/core/testing';

import { HidService } from './hid.service';

describe('HidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HidService = TestBed.get(HidService);
    expect(service).toBeTruthy();
  });
});
