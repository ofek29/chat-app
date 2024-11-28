import test, { expect, Page } from "@playwright/test";
import generator from 'generate-password';


// const VITE_SERVER_HOST =  .env.VITE_SERVER_PORT || 'localhost';
// const VITE_SERVER_PORT = '5173';

// const siteUrl = ``

async function registerUser(page: Page) {
    const email = `${generateString()}@${generateString()}.com`;
    const name = generateString();
    const password = generateStrongPassword();
    await page.goto('0.0.0.0:5173/register');
    // await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').fill(name);
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('link', { name: name })).toBeVisible();
    return { name, email, password };
}

test('test week password', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').fill(generateString());
    await page.getByPlaceholder('Email').fill(`${generateString()}@${generateString()}.com`);
    await page.getByPlaceholder('Password').fill(generateWeekPassword());
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('passwords must be at least 8 characters and contain 1 uppercase, lowercase, number and symbol')).toBeVisible();
});

test('test week password short', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').fill(generateString());
    await page.getByPlaceholder('Email').fill(`${generateString()}@${generateString()}.com`);
    await page.getByPlaceholder('Password').fill(generateShortPassword());
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('passwords must be at least 8 characters and contain 1 uppercase, lowercase, number and symbol')).toBeVisible();
});

test('test new register success ', async ({ page }) => {
    await registerUser(page);
});

test('test register: user already exists', async ({ page }) => {
    const { email } = await registerUser(page);
    await page.getByRole('link', { name: 'Logout' }).click();

    await page.goto('http://localhost:5173/register');
    await page.getByPlaceholder('Name').fill(generateString());
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(generateStrongPassword());
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('User already exists')).toBeVisible();
});

test('test login: wrong password', async ({ page }) => {
    const { email } = await registerUser(page);
    await page.getByRole('link', { name: 'Logout' }).click();

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
    const { name, email, password } = await registerUser(page);
    await page.getByRole('link', { name: 'Logout' }).click();

    await page.goto('http://localhost:5173/login');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: name })).toBeVisible();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});

function generateString() {
    const length = Math.floor(Math.random() * 20) + 3;
    return generator.generate({
        length: length,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
    });
}

function generateStrongPassword() {
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