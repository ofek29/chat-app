import test, { expect } from "@playwright/test";
import generator from 'generate-password';


test('test week password', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').fill(generateString());
    await page.getByPlaceholder('Email').fill(`${generateString()}@${generateString()}.com`);
    await page.getByPlaceholder('Password').fill(generateWeekPassword());
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('passwords must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 number and 1 symbols')).toBeVisible();
});


test('test week password short', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').fill(generateString());
    await page.getByPlaceholder('Email').fill(`${generateString()}@${generateString()}.com`);
    await page.getByPlaceholder('Password').fill(generateShortPassword());
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('passwords must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 number and 1 symbols')).toBeVisible();
});

const email = `${generateString()}@${generateString()}.com`;
const name = generateString();
const password = generateStrongPassword();

test('test new register success', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').fill(name);
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('link', { name: name })).toBeVisible();
});

test('test register: user already exists', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').fill(generateString());
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(generateStrongPassword());
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('User already exists')).toBeVisible();
});

test('test login: wrong password', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(generateStrongPassword());
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Invalid email or password')).toBeVisible();
});

test('test login: wrong email', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByPlaceholder('Email').fill(`${generateString()}@${generateString()}.com`);
    await page.getByPlaceholder('Password').fill(generateStrongPassword());
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Invalid email or password')).toBeVisible();
});

test('test login success and logout', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: name })).toBeVisible();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
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
        strict: false
    });
}

export function generateShortPassword() {
    const length = Math.floor(Math.random() * 4) + 4;
    return generator.generate({
        length: length,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        strict: true
    });
}

export function generateWeekPassword() {
    const length = Math.floor(Math.random() * 22) + 8;
    //choose a random value to be false
    const bool = [true, true, true, true];
    const randomIndex = Math.floor(Math.random() * 4);
    bool[randomIndex] = false;

    return generator.generate({
        length: length,
        uppercase: bool[0],
        lowercase: bool[1],
        numbers: bool[2],
        symbols: bool[3],
        strict: true
    });
} 