import { FirebaseAuthenticationWithAngular5Page } from './app.po';

describe('firebase-authentication-with-angular-5 App', function() {
  let page: FirebaseAuthenticationWithAngular5Page;

  beforeEach(() => {
    page = new FirebaseAuthenticationWithAngular5Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
