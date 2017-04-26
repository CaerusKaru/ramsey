import { RamseyPage } from './app.po';

describe('ramsey App', () => {
  let page: RamseyPage;

  beforeEach(() => {
    page = new RamseyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
