import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContributorsService, Contributor } from './contributors.service';

const MOCK_CONTRIBUTORS: Contributor[] = [
  { login: 'alice', avatar_url: 'https://avatars.githubusercontent.com/u/1', html_url: 'https://github.com/alice', contributions: 10 },
  { login: 'bob',   avatar_url: 'https://avatars.githubusercontent.com/u/2', html_url: 'https://github.com/bob',   contributions: 3  },
];

describe('ContributorsService', () => {
  let service: ContributorsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContributorsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('fetches from the correct GitHub API endpoint', () => {
    service.getContributors().subscribe();
    const req = http.expectOne(
      'https://api.github.com/repos/victorovento/developer-website-ideas/contributors?per_page=100'
    );
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_CONTRIBUTORS);
  });

  it('returns contributor data', () => {
    service.getContributors().subscribe((contributors) => {
      expect(contributors.length).toBe(2);
      expect(contributors[0].login).toBe('alice');
      expect(contributors[1].login).toBe('bob');
    });
    http.expectOne((r) => r.url.includes('contributors')).flush(MOCK_CONTRIBUTORS);
  });

  it('returns an empty array on HTTP error', () => {
    service.getContributors().subscribe((contributors) => {
      expect(contributors).toEqual([]);
    });
    http
      .expectOne((r) => r.url.includes('contributors'))
      .flush('Server error', { status: 403, statusText: 'Forbidden' });
  });
});
