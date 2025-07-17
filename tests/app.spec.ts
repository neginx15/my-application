import { test, expect } from '@playwright/test';

test.describe('App E2E Tests', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main heading is visible
    await expect(page.getByText('Vite + React')).toBeVisible();
    
    // Check if both logos are present
    await expect(page.getByAltText('Vite logo')).toBeVisible();
    await expect(page.getByAltText('React logo')).toBeVisible();
  });

  test('counter functionality', async ({ page }) => {
    await page.goto('/');
    
    // Get the counter button
    const counterButton = page.getByText(/count is/i);
    
    // Check initial state
    await expect(counterButton).toHaveText('count is 0');
    
    // Click the button
    await counterButton.click();
    
    // Check if counter increased
    await expect(counterButton).toHaveText('count is 1');
  });

  test('API integration', async ({ page }) => {
    // Start the server before running the test
    await page.goto('/');
    
    // Make an API call to the server
    const response = await page.request.get('http://localhost:3000/api/data');
    
    // Check if the response is correct
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toEqual({
      message: 'Hello from server!',
      data: [1, 2, 3]
    });
  });
}); 