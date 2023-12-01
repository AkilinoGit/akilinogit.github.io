import { TestBed } from '@angular/core/testing';

import { TxServiceService } from './tx-service.service';

describe('TxServiceService', () => {
  let service: TxServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TxServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
