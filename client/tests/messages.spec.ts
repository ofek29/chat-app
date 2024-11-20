import { test, expect, Page } from '@playwright/test';
import generator from 'generate-password';

async function registerUser(page: Page) {
  const email = `${generateString()}@${generateString()}.com`;
  const name = generateString();
  const password = generateStrongPassword();
  await page.goto('http://localhost:5173/register');
  await page.getByPlaceholder('Name').fill(name);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByRole('link', { name: name })).toBeVisible();
  return { name, email, password };
}

async function sendMessage(page: Page, name: string) {
  await page.locator('div.flex.items-center p.font-semibold').filter({ hasText: name }).click();
  const randomMessage = generateString();
  await page.getByPlaceholder('Type your message...').fill(randomMessage);
  await page.getByPlaceholder('Type your message...').press('Enter');
  return randomMessage;
}


test('two users in the same chat room messages', async ({ browser }) => {
  // Open browser context
  const user1Context = await browser.newContext();
  const user1Page = await user1Context.newPage();
  const user2Context = await browser.newContext();
  const user2Page = await user2Context.newPage();

  // Register 2 users
  const { name: user1Name } = await registerUser(user1Page);
  const { name: user2Name } = await registerUser(user2Page);

  // send messages and see if they received
  await user1Page.goto('http://localhost:5173');

  await user1Page.getByPlaceholder('Search for user').fill(user2Name);
  await user1Page.locator('div.text-center.w-40').filter({ hasText: user2Name }).click();

  const randomMessage1 = await sendMessage(user1Page, user2Name);

  await user2Page.goto('http://localhost:5173');
  const randomMessage2 = await sendMessage(user2Page, user1Name);
  await expect(user2Page.locator('div.break-words.hyphens-auto.max-w-60').filter({ hasText: randomMessage1 })).toBeVisible();

  await user1Page.goto('http://localhost:5173'); //todo fix socket!
  await user1Page.locator('div.flex.items-center p.font-semibold').filter({ hasText: user2Name }).click();
  await expect(user1Page.locator('div.break-words.hyphens-auto.max-w-60').filter({ hasText: randomMessage2 })).toBeVisible();

  await user1Context.close();
  await user2Context.close();
});

export function generateString() {
  const length = Math.floor(Math.random() * 20) + 3;
  return generator.generate({
    length: length,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
}

export function generateStrongPassword() {
  const length = Math.floor(Math.random() * 22) + 8;
  return generator.generate({
    length: length,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    strict: true
  });
}