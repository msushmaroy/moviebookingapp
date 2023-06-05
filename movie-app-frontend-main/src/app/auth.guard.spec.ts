import { AuthGuard } from './auth.guard';
import { MovieService } from './movie.service';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';


describe('AuthGuard', () => {
  let guard: AuthGuard;
  let movieService: MovieService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, MovieService,HttpClient,HttpHandler]
    });
    guard = TestBed.inject(AuthGuard);
    movieService = TestBed.inject(MovieService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is authenticated', () => {
    spyOn(movieService, 'isAuthenticated').and.returnValue(true);
    spyOn(router, 'navigate');

    const canActivate = guard.canActivate();

    expect(canActivate).toBeTrue();
    expect(movieService.isAuthenticated).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login page if user is not authenticated', () => {
    spyOn(movieService, 'isAuthenticated').and.returnValue(false);
    spyOn(router, 'navigate');

    const canActivate = guard.canActivate();

    expect(canActivate).toBeFalse();
    expect(movieService.isAuthenticated).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });
});
