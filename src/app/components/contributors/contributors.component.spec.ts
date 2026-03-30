import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContributorsComponent } from './contributors.component';
import { ContributorsService, Contributor } from '../../services/contributors.service';

const MOCK_CONTRIBUTORS: Contributor[] = [
  { login: 'alice', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4', html_url: 'https://github.com/alice', contributions: 10 },
  { login: 'bob',   avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4', html_url: 'https://github.com/bob',   contributions: 3  },
];

const mockService = (contributors: Contributor[]) => ({
  getContributors: () => of(contributors),
});

describe('ContributorsComponent', () => {
  let fixture: ComponentFixture<ContributorsComponent>;
  let component: ContributorsComponent;

  const configure = async (contributors: Contributor[]) => {
    await TestBed.configureTestingModule({
      imports: [ContributorsComponent],
      providers: [
        { provide: ContributorsService, useValue: mockService(contributors) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('creates the component', async () => {
    await configure(MOCK_CONTRIBUTORS);
    expect(component).toBeTruthy();
  });

  it('loads contributors on init', async () => {
    await configure(MOCK_CONTRIBUTORS);
    expect(component.contributors.length).toBe(2);
  });

  it('renders an avatar for each contributor', async () => {
    await configure(MOCK_CONTRIBUTORS);
    const avatars = fixture.nativeElement.querySelectorAll('.contributors__avatar');
    expect(avatars.length).toBe(2);
  });

  it('renders contributor links pointing to their GitHub profiles', async () => {
    await configure(MOCK_CONTRIBUTORS);
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('.contributors__item');
    expect(links[0].href).toContain('github.com/alice');
    expect(links[1].href).toContain('github.com/bob');
  });

  it('does not render the section when the contributor list is empty', async () => {
    await configure([]);
    const section = fixture.nativeElement.querySelector('.contributors');
    expect(section).toBeNull();
  });

  it('shows how many people contributed', async () => {
    await configure(MOCK_CONTRIBUTORS);
    const text: string = fixture.nativeElement.querySelector('.contributors__sub')?.textContent ?? '';
    expect(text).toContain('2');
  });
});
