import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/"

//page provided by playwright
test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);
  //get sign in button
  await page.getByRole("link", { name: "Sign In"}).click(); //waits for click to happen
  //check if Sign In header appears in browser, when checking if something is on the screen .toBeVisible() is good to use
  await expect(page.getByRole("heading", {name: "Sign In"})).toBeVisible();
  //enter input field in sign in page
  await page.locator("[name=email]").fill("test12@gmail.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", {name: "Login" }).click();
  //user has successfully signed in, below is what's expected to see.
  await expect(page.getByText("Sign in Successful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Booking"})).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out"})).toBeVisible();
});
//Need to generate a random user email everytime so that the test will pass with a unique email that is not used before
//Keep in mind to delete users occassionally 
test("should allow user to register", async({page}) => {
  const testEmail = `test_register_${Math.floor(Math.random() * 90000) + 100000}@email.com`;
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In"}).click();
  await page.getByRole("link", { name: "Create an account here"}).click();
  await expect(page.getByRole("heading", {name: "Create an Account"})).toBeVisible(); 

  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  await page.getByRole("button", {name: "Create Account"}).click();

  await expect(page.getByText("Registration Success")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Booking"})).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out"})).toBeVisible();
})