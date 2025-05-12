import { test, expect } from '@playwright/test';

test('Automate demo site payment journey and simulate OTP', async ({ page }) => {
  // Step 1: Open demo e-commerce site
  await page.goto('https://www.demoblaze.com/');
  await expect(page).toHaveTitle(/STORE/);

  // Step 2: Choose a product category and item
  await page.click('a:has-text("Laptops")');
  await page.waitForSelector('a:has-text("Sony vaio i5")');
  await page.click('a:has-text("Sony vaio i5")');

  // Step 3: Add product to cart
  await page.waitForSelector('a:has-text("Add to cart")');
  await page.click('a:has-text("Add to cart")');
  await page.waitForTimeout(2000); // Alert will appear
  await page.once('dialog', dialog => dialog.accept());

  // Step 4: Go to Cart and place order
  await page.click('a#cartur'); // Go to cart
  await page.waitForSelector('button:has-text("Place Order")');
  await page.click('button:has-text("Place Order")');

  // Step 5: Fill order form (simulate payment)
  await page.fill('#name', 'Kirtibas Paul');
  await page.fill('#country', 'India');
  await page.fill('#city', 'Bangalore');
  await page.fill('#card', '4111 1111 1111 1111');
  await page.fill('#month', '12');
  await page.fill('#year', '2025');

  // Step 6: Purchase
  await page.click('button:has-text("Purchase")');

  // Step 7: Simulate OTP screen (mock)
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.innerText = 'OTP Sent to your phone. Please enter to continue...';
    div.style.cssText = 'position:fixed;top:40%;left:30%;padding:30px;background:white;border:2px solid black;font-size:20px;z-index:9999;';
    document.body.appendChild(div);
  });

  // Step 8: Simulate OTP input and verification (mock)
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const otpInput = document.createElement('input');
    otpInput.placeholder = 'Enter 6-digit OTP';
    otpInput.style.cssText = 'position:fixed;top:50%;left:30%;padding:10px;z-index:9999;margin-top:10px;width:200px;';
    
    const submitBtn = document.createElement('button');
    submitBtn.innerText = 'Verify OTP';
    submitBtn.style.cssText = 'position:fixed;top:50%;left:46%;padding:10px;z-index:9999;margin-top:10px;background:#28a745;color:white;border:none;';
    
    document.body.appendChild(otpInput);
    document.body.appendChild(submitBtn);
  });

  // Step 9: Wait for demonstration purposes
  await page.waitForTimeout(4000);
  
  // Step 10: Show success message (mock)
  await page.evaluate(() => {
    document.querySelectorAll('div[style*="z-index:9999"], input[style*="z-index:9999"], button[style*="z-index:9999"]')
      .forEach(el => el.remove());
      
    const successDiv = document.createElement('div');
    successDiv.innerText = 'Payment Successful! Order Confirmed.';
    successDiv.style.cssText = 'position:fixed;top:40%;left:30%;padding:30px;background:#d4edda;border:2px solid #28a745;color:#155724;font-size:20px;z-index:9999;';
    document.body.appendChild(successDiv);
  });
  
  await page.waitForTimeout(3000); // Show success message
}); 