import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser',
  fullyParallel:true,
  forbidOnly:true,
  retries:0,
  workers:2,
  timeout:90_000,
  // The full language/viewport matrix includes tiled captures of long guides.
  globalTimeout:30*60_000,
  expect:{timeout:10_000},
  outputDir:'output/ci/test-results',
  reporter:[['list'],['html',{outputFolder:'output/ci/playwright-report',open:'never'}],['json',{outputFile:'output/ci/browser-results.json'}]],
  use:{browserName:'chromium',reducedMotion:'reduce',actionTimeout:12000,trace:'retain-on-failure',video:'retain-on-failure',launchOptions:{args:['--enable-unsafe-swiftshader']}}
});
