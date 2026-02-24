// Dummy E2E test — validates that the app launches and the home screen
// loads without crashing. Run with: npm run test:e2e
// Requires a simulator/emulator and a debug build: npm run test:e2e:build

describe('App launch', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  it('should show the home screen after launch', async () => {
    // The home screen displays an "Identify" button — wait for it to appear
    await expect(element(by.text('Identify'))).toBeVisible();
  });

  it('should show the bottom navigation tabs', async () => {
    await expect(element(by.text('HerdBook'))).toBeVisible();
    await expect(element(by.text('CowDex'))).toBeVisible();
    await expect(element(by.text('Settings'))).toBeVisible();
  });
});
