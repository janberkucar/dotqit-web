import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../../core/language/language.service';
import { OutageStatusPipe } from './outage-status.pipe';

describe('OutageStatusPipe', () => {
  let pipe: OutageStatusPipe;

  beforeEach(() => {
    const labels: Record<string, string> = {
      'outage.status.0': 'Detected',
      'outage.status.1': 'Confirmed',
      'outage.status.2': 'Dispatched',
      'outage.status.3': 'Restoring',
      'outage.status.4': 'Restored',
      'outage.status.5': 'Cancelled',
      'outage.status.unknown': 'Unknown',
    };

    TestBed.configureTestingModule({
      providers: [
        OutageStatusPipe,
        {
          provide: LanguageService,
          useValue: {
            t: (key: string) => labels[key] ?? key,
          },
        },
      ],
    });

    pipe = TestBed.inject(OutageStatusPipe);
  });

  it('humanizes all six lifecycle states', () => {
    expect(pipe.transform(0)).toBe('Detected');
    expect(pipe.transform(1)).toBe('Confirmed');
    expect(pipe.transform(2)).toBe('Dispatched');
    expect(pipe.transform(3)).toBe('Restoring');
    expect(pipe.transform(4)).toBe('Restored');
    expect(pipe.transform(5)).toBe('Cancelled');
  });

  it('falls back for unknown codes', () => {
    expect(pipe.transform(42)).toBe('Unknown');
    expect(pipe.transform('not-a-number')).toBe('Unknown');
    expect(pipe.transform(null)).toBe('Unknown');
    expect(pipe.transform(undefined)).toBe('Unknown');
  });
});
