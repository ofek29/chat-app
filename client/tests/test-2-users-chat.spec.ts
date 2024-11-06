import { test, expect } from '@playwright/test';

test('two users in the same chat room messages', async ({ browser }) => {
  // Open the first browser context (for User1)
  const user1Context = await browser.newContext();
  const user1Page = await user1Context.newPage();
  await user1Page.goto('http://localhost:5173/login');

  // Log in as User1
  await user1Page.getByPlaceholder('Email').click();
  await user1Page.getByPlaceholder('Email').fill('ofek@gmail.com');
  await user1Page.getByPlaceholder('Password').fill('O!f12y345678');
  await user1Page.getByPlaceholder('Password').press('Enter');
  await expect(user1Page.getByText('Select chat...')).toBeVisible();
  await user1Page.locator('p').filter({ hasText: 'avi' }).click();
  await user1Page.getByPlaceholder('Type your message...').click();
  const user1Text = randomMessage();
  await user1Page.getByPlaceholder('Type your message...').fill(user1Text);
  await user1Page.getByPlaceholder('Type your message...').press('Enter');


  // Open the second browser context (for User2)
  const user2Context = await browser.newContext();
  const user2Page = await user2Context.newPage();
  await user2Page.goto('http://localhost:5173/login');

  await user2Page.getByPlaceholder('Email').click();
  await user2Page.getByPlaceholder('Email').fill('avi@gmail.com');
  await user2Page.getByPlaceholder('Password').fill('12345678Avi!');
  await user2Page.getByRole('button', { name: 'Login' }).click();
  await user2Page.locator('p').filter({ hasText: 'ofek' }).click();
  await user2Page.getByPlaceholder('Type your message...').click();
  const user2Text = randomMessage();
  await user2Page.getByPlaceholder('Type your message...').fill(user2Text);
  await user2Page.getByPlaceholder('Type your message...').press('Enter');

  // reload the page (i don't have socket yet)
  await user1Page.goto('http://localhost:5173/');
  await user1Page.locator('p').filter({ hasText: 'avi' }).click();
  await user2Page.goto('http://localhost:5173/');
  await user2Page.locator('p').filter({ hasText: 'ofek' }).click();



  // await expect(user2Page.locator('div').getByText(user1Text)).toBeDefined();

  // make sure message exists after reload and the scroll down is working
  await expect(user2Page.getByText(user1Text)).toBeVisible();
  await expect(user1Page.getByText(user2Text)).toBeVisible();


  await user1Context.close();
  await user2Context.close();
});

function randomMessage() {
  return `${Math.random().toString(36).slice(2)}`;
}
