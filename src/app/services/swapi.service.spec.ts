import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SwapiService } from './swapi.service';

describe('SwapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [SwapiService]
  }));

  it('should be created', () => {
    const service: SwapiService = TestBed.get(SwapiService);
    expect(service).toBeTruthy();
  });
});
