import { test, expect } from '@playwright/test';
import { generateString, generateStrongPassword } from './auth.spec';


test('two users in the same chat room messages', async ({ browser }) => {
  // Open browser context
  const user1Context = await browser.newContext();
  const user1Page = await user1Context.newPage();
  const user2Context = await browser.newContext();
  const user2Page = await user2Context.newPage();

  // Register 2 users
  await user1Page.goto('http://localhost:5173/register');
  const user1Name = generateString();
  await user1Page.getByPlaceholder('Name').fill(user1Name);
  await user1Page.getByPlaceholder('Email').fill(`${generateString()}@${generateString()}.com`);
  await user1Page.getByPlaceholder('Password').fill(generateStrongPassword());
  await user1Page.getByRole('button', { name: 'Register' }).click();

  await user2Page.goto('http://localhost:5173/register');
  const user2Name = generateString();
  await user2Page.getByPlaceholder('Name').fill(user2Name);
  await user2Page.getByPlaceholder('Email').fill(`${generateString()}@${generateString()}.com`);
  await user2Page.getByPlaceholder('Password').fill(generateStrongPassword());
  await user2Page.getByRole('button', { name: 'Register' }).click();

  // send messages and see if they received
  await user1Page.goto('http://localhost:5173/');
  await user1Page.getByPlaceholder('Search for user').fill(user2Name);
  // await user1Page.locator('div').filter({ hasText: user2Name }).click();
  await user1Page.locator('.text-center mb-3 py-1 px-2 border border-gray-500 rounded-lg w-40').filter({ hasText: user2Name }).click();
  await user1Page.locator('p').filter({ hasText: user2Name }).click();
  const randomMessage1 = generateString();
  await user1Page.getByPlaceholder('Type your message...').fill(randomMessage1);
  await user1Page.getByPlaceholder('Type your message...').press('Enter');

  await user2Page.goto('http://localhost:5173/');
  await user2Page.locator('p').filter({ hasText: user1Name }).click();
  await expect(user2Page.getByText(randomMessage1)).toBeVisible();
  const randomMessage2 = generateString();
  await user2Page.getByPlaceholder('Type your message...').fill(randomMessage2);
  await user2Page.getByPlaceholder('Type your message...').press('Enter');

  await user1Page.goto('http://localhost:5173/');
  await user1Page.locator('p').filter({ hasText: user2Name }).click();
  await expect(user1Page.getByText(randomMessage2)).toBeVisible();

  await user1Context.close();
  await user2Context.close();
});