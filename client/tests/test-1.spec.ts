import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
});
test('test login send message and logout', async ({ page }) => {
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('ofek@gmail.com');
  await page.getByPlaceholder('Email').press('Tab');
  await page.getByPlaceholder('Password').fill('O!f12y345678');
  await page.getByPlaceholder('Password').press('Enter');
  await expect(page.getByText('Select chat...')).toBeVisible();
  await page.locator('p').filter({ hasText: 'avi' }).click();
  await page.getByPlaceholder('Type your message...').click();
  await page.getByPlaceholder('Type your message...').fill('playwright test');
  await page.getByPlaceholder('Type your message...').press('Enter');
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

});

test('test login for avi and logout', async ({ page }) => {
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('avi@gmail.com');
  await page.getByPlaceholder('Email').press('Tab');
  await page.getByPlaceholder('Password').fill('12345678Avi!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('p').filter({ hasText: 'ofek' }).click();
  await page.getByPlaceholder('Type your message...').click();
  await page.getByPlaceholder('Type your message...').fill('playwright test back');
  await page.getByPlaceholder('Type your message...').press('Enter');
  await page.locator('p').filter({ hasText: 'rubi' }).click();
  await page.getByPlaceholder('Type your message...').click();
  await page.getByPlaceholder('Type your message...').fill('playwright test 2 rubi');
  await page.getByPlaceholder('Type your message...').press('Enter');
  await page.locator('p').filter({ hasText: 'ofek' }).click();
  await page.getByPlaceholder('Type your message...').click();
  await page.getByPlaceholder('Type your message...').fill('lets go');
  await page.getByPlaceholder('Type your message...').press('Enter');
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

});