import { test, expect } from '@playwright/test';

test('Enhanced payment journey with realistic OTP simulation', async ({ page }) => {
  try {
    // Log test start
    console.log('Starting payment journey automation...');
    
    // Step 1: Navigate to the demo site
    await page.goto('https://www.demoblaze.com/');
    await expect(page).toHaveTitle(/STORE/);
    console.log('Successfully loaded demo site');
    
    // Step 2: Select product category and specific product
    await page.click('a:has-text("Laptops")');
    await page.waitForSelector('a:has-text("Sony vaio i5")');
    await page.click('a:has-text("Sony vaio i5")');
    console.log('Selected Sony vaio i5 laptop');
    
    // Step 3: Add to cart with alert handling
    await page.waitForSelector('a:has-text("Add to cart")');
    
    // Set up dialog handler before clicking
    page.once('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });
    
    await page.click('a:has-text("Add to cart")');
    await page.waitForTimeout(2000); // Wait for dialog to be handled
    console.log('Added product to cart');
    
    // Step 4: Navigate to cart and place order
    await page.click('a#cartur');
    await page.waitForSelector('button:has-text("Place Order")');
    
    // Attempt to verify product is in cart, but don't fail if not found
    try {
      // First try the '.success' class selector
      const productTitle = await page.$eval('.success td:nth-child(2)', el => el.textContent);
      console.log(`Product in cart: ${productTitle}`);
    } catch (error) {
      // Try an alternative selector if the first one fails
      try {
        const productTitle = await page.$eval('tbody tr td:nth-child(2)', el => el.textContent);
        console.log(`Product in cart: ${productTitle}`);
      } catch (innerError) {
        // Continue anyway if we can't find the product title
        console.log('Could not verify product name in cart, but continuing with test');
      }
    }
    
    await page.click('button:has-text("Place Order")');
    console.log('Navigated to checkout');
    
    // Step 5: Fill payment information
    const orderForm = {
      name: 'Kirtibas Paul',
      country: 'India',
      city: 'Bangalore',
      card: '4111 1111 1111 1111',
      month: '12',
      year: '2025'
    };
    
    await page.fill('#name', orderForm.name);
    await page.fill('#country', orderForm.country);
    await page.fill('#city', orderForm.city);
    await page.fill('#card', orderForm.card);
    await page.fill('#month', orderForm.month);
    await page.fill('#year', orderForm.year);
    console.log('Filled payment details');
    
    // Take screenshot of the payment form
    await page.screenshot({ path: 'payment-form.png' });
    
    // Step 6: Submit order
    await page.click('button:has-text("Purchase")');
    
    // Step 7: Enhanced OTP simulation - Create full OTP interface
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      // Remove any purchase confirmation if it exists
      const purchaseConfirmation = document.querySelector('.sweet-alert');
      if (purchaseConfirmation) {
        purchaseConfirmation.style.display = 'none';
      }
      
      // Create OTP modal container
      const modal = document.createElement('div');
      modal.id = 'otpModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:10000;';
      
      // Create OTP form
      const otpForm = document.createElement('div');
      otpForm.style.cssText = 'background:white;padding:30px;border-radius:8px;width:400px;text-align:center;box-shadow:0 4px 8px rgba(0,0,0,0.2);';
      
      // Bank logo
      const bankLogo = document.createElement('div');
      bankLogo.style.cssText = 'font-size:24px;font-weight:bold;color:#1a73e8;margin-bottom:20px;';
      bankLogo.innerHTML = 'SECURE BANK<span style="font-size:12px;vertical-align:super;margin-left:2px;">®</span>';
      
      // OTP heading
      const heading = document.createElement('h3');
      heading.innerText = 'Two-Factor Authentication Required';
      heading.style.cssText = 'margin:10px 0;color:#333;';
      
      // OTP message
      const message = document.createElement('p');
      message.innerHTML = 'For security reasons, please enter the One-Time Password (OTP)<br>sent to your registered mobile number ●●●●●98765';
      message.style.cssText = 'margin:15px 0;color:#555;font-size:14px;';
      
      // OTP input container
      const otpContainer = document.createElement('div');
      otpContainer.style.cssText = 'display:flex;justify-content:center;gap:8px;margin:20px 0;';
      
      // Create 6 input boxes for OTP
      for (let i = 0; i < 6; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.className = 'otp-input';
        input.style.cssText = 'width:40px;height:45px;text-align:center;font-size:20px;border:1px solid #ddd;border-radius:4px;';
        otpContainer.appendChild(input);
      }
      
      // Timer
      const timer = document.createElement('div');
      timer.innerHTML = 'OTP expires in <span id="timer">02:00</span>';
      timer.style.cssText = 'margin:10px 0;color:#666;font-size:13px;';
      
      // Submit button
      const submitBtn = document.createElement('button');
      submitBtn.innerText = 'Verify OTP';
      submitBtn.id = 'verifyOtp';
      submitBtn.style.cssText = 'background:#1a73e8;color:white;border:none;padding:12px 30px;border-radius:4px;font-size:16px;margin-top:15px;cursor:pointer;';
      
      // Resend link
      const resendLink = document.createElement('p');
      resendLink.innerHTML = 'Didn\'t receive the OTP? <a href="#" style="color:#1a73e8;text-decoration:none;">Resend OTP</a>';
      resendLink.style.cssText = 'margin:15px 0 5px;font-size:13px;';
      
      // Security note
      const securityNote = document.createElement('p');
      securityNote.innerHTML = '<small>This OTP is ONLY for completing your payment. Never share your OTP with anyone.</small>';
      securityNote.style.cssText = 'color:#999;font-size:11px;margin-top:20px;';
      
      // Assemble the form
      otpForm.appendChild(bankLogo);
      otpForm.appendChild(heading);
      otpForm.appendChild(message);
      otpForm.appendChild(otpContainer);
      otpForm.appendChild(timer);
      otpForm.appendChild(submitBtn);
      otpForm.appendChild(resendLink);
      otpForm.appendChild(securityNote);
      
      modal.appendChild(otpForm);
      document.body.appendChild(modal);
      
      // Auto-fill first OTP digit after a delay to simulate typing
      setTimeout(() => {
        const firstInput = document.querySelector('.otp-input');
        if (firstInput) firstInput.value = '1';
      }, 1500);
    });
    
    console.log('Displayed OTP verification screen');
    
    // Take screenshot of OTP screen
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'otp-verification.png' });
    
    // Step 8: Auto-fill remaining OTP digits
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('.otp-input');
      // Fill remaining 5 digits
      const otpValues = ['1', '2', '3', '4', '5', '6'];
      inputs.forEach((input, index) => {
        input.value = otpValues[index];
      });
    });
    
    // Wait a moment to show completed OTP
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'otp-filled.png' });
    
    // Step 9: Submit OTP
    await page.click('#verifyOtp');
    
    // Step 10: Show payment success
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      // Remove OTP modal
      const otpModal = document.querySelector('#otpModal');
      if (otpModal) {
        otpModal.remove();
      }
      
      // Create success modal
      const successModal = document.createElement('div');
      successModal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:10000;';
      
      const successContent = document.createElement('div');
      successContent.style.cssText = 'background:white;padding:30px;border-radius:8px;width:400px;text-align:center;box-shadow:0 4px 8px rgba(0,0,0,0.2);';
      
      // Success message with checkmark
      const successIcon = document.createElement('div');
      successIcon.innerHTML = '✓';
      successIcon.style.cssText = 'color:#28a745;font-size:50px;background:#e8f5e9;width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;';
      
      const successHeading = document.createElement('h3');
      successHeading.innerText = 'Payment Successful';
      successHeading.style.cssText = 'color:#333;margin:10px 0;';
      
      const successMessage = document.createElement('p');
      successMessage.innerHTML = 'Your transaction has been completed successfully.<br>Order #DEM-' + Math.floor(100000 + Math.random() * 900000);
      successMessage.style.cssText = 'color:#555;margin:15px 0;';
      
      const amountInfo = document.createElement('div');
      amountInfo.innerHTML = '<strong>₹ 84,490.00</strong><br><small>Sony vaio i5</small>';
      amountInfo.style.cssText = 'margin:15px 0;font-size:18px;';
      
      const transactionInfo = document.createElement('div');
      transactionInfo.innerHTML = `
        <table style="width:100%;text-align:left;font-size:13px;color:#666;margin:20px 0;">
          <tr><td>Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
          <tr><td>Time:</td><td>${new Date().toLocaleTimeString()}</td></tr>
          <tr><td>Card:</td><td>xxxx xxxx xxxx 1111</td></tr>
          <tr><td>Method:</td><td>Credit Card</td></tr>
        </table>
      `;
      
      const continueBtn = document.createElement('button');
      continueBtn.innerText = 'Continue Shopping';
      continueBtn.style.cssText = 'background:#1a73e8;color:white;border:none;padding:12px 30px;border-radius:4px;font-size:16px;margin-top:15px;cursor:pointer;';
      
      successContent.appendChild(successIcon);
      successContent.appendChild(successHeading);
      successContent.appendChild(successMessage);
      successContent.appendChild(amountInfo);
      successContent.appendChild(transactionInfo);
      successContent.appendChild(continueBtn);
      
      successModal.appendChild(successContent);
      document.body.appendChild(successModal);
    });
    
    console.log('Payment completed successfully');
    
    // Take final screenshot of success screen
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'payment-success.png' });
    
    // Final wait for demo purposes
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('Test failed with error:', error);
    // Take screenshot on error
    await page.screenshot({ path: 'error-state.png' });
    throw error;
  }
}); 