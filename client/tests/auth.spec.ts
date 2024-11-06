import test, { expect } from "@playwright/test";


test('test week password', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill('test');
    await page.getByPlaceholder('Name').press('Tab');
    await page.getByPlaceholder('Email').fill('test@gmail.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('gggggggggggggg');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('passwords must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 number and 1 symbols')).toBeVisible();
});

test('test week password symbol missing', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill('test');
    await page.getByPlaceholder('Name').press('Tab');
    await page.getByPlaceholder('Email').fill('test@gmail.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Ggggggg3');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('passwords must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 number and 1 symbols')).toBeVisible();
});

test('test week password short', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill('test');
    await page.getByPlaceholder('Name').press('Tab');
    await page.getByPlaceholder('Email').fill('test@gmail.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Gg1234!');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('passwords must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 number and 1 symbols')).toBeVisible();
});

test('test user already exists', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill('test');
    await page.getByPlaceholder('Name').press('Tab');
    await page.getByPlaceholder('Email').fill('ofek@gmail.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Gg1234!');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('User already exists')).toBeVisible();
});

test('test new register success', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill('playwright test');
    await page.getByPlaceholder('Name').press('Tab');
    await page.getByPlaceholder('Email').fill(`${Math.random().toString(36).slice(2)}@gmail.com`);
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Gg12345!');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('link', { name: 'playwright test' })).toBeVisible();
});

test('test wrong password', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByPlaceholder('Email').fill('test@gmail.com');
    await page.getByPlaceholder('Password').fill('Ggggggg3');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Invalid email or password')).toBeVisible();
});
test('test wrong email', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByPlaceholder('Email').fill('te@gmail.com');
    await page.getByPlaceholder('Password').fill('Gg12345!');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Invalid email or password')).toBeVisible();
});

test('test login success', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByPlaceholder('Email').fill('test@gmail.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Gg12345!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 'test' })).toBeVisible();

});


// gpt random strong password
function generatePassword(length: number) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    // Ensure the password has at least one character from each set
    const allChars = lowercase + uppercase + numbers + symbols;
    let password = [
        lowercase[Math.floor(Math.random() * lowercase.length)],
        uppercase[Math.floor(Math.random() * uppercase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
    ];

    // Fill the remaining length with random characters from all sets
    for (let i = 4; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle the array to prevent predictable patterns
    password = password.sort(() => 0.5 - Math.random());

    // Join to make a string and return
    return password.join('');
}

console.log(generatePassword(12)); // Example output: "G9$hxk!2LdY1"
