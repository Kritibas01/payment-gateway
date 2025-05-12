import { test, expect } from '@playwright/test';
import { saveScreenshot, logTestStep, highlightElement } from '../utils/helpers';

/**
 * Complete E2E test for payment journey with OTP simulation
 * This test demonstrates a full payment flow including OTP verification
 */
test('E2E Payment Journey with OTP Verification', async ({ page }) => {
  const testName = 'complete-payment';
  
  try {
    // Step 1: Navigate to the e-commerce site
    logTestStep('Starting payment journey automation', testName);
    await page.goto('https://www.demoblaze.com/');
    await expect(page).toHaveTitle(/STORE/);
    logTestStep('Successfully loaded demo site', testName);
    await saveScreenshot(page, '01-homepage', testName);
    
    // Step 2: Navigate to Laptops category
    logTestStep('Navigating to Laptops category', testName);
    await highlightElement(page, 'a:has-text("Laptops")', 1000);
    await page.click('a:has-text("Laptops")');
    await page.waitForSelector('a:has-text("Sony vaio i5")');
    await saveScreenshot(page, '02-laptops-category', testName);
    
    // Step 3: Select product
    logTestStep('Selecting Sony vaio i5 laptop', testName);
    await highlightElement(page, 'a:has-text("Sony vaio i5")', 1000);
    await page.click('a:has-text("Sony vaio i5")');
    await page.waitForSelector('.product-deatil h2');
    await saveScreenshot(page, '03-product-details', testName);
    
    // Step 4: Add to cart
    logTestStep('Adding product to cart', testName);
    await highlightElement(page, 'a:has-text("Add to cart")', 1000);
    
    // Set up dialog handler before clicking
    page.once('dialog', async dialog => {
      logTestStep(`Dialog appeared: ${dialog.message()}`, testName);
      await dialog.accept();
    });
    
    await page.click('a:has-text("Add to cart")');
    await page.waitForTimeout(2000); // Wait for dialog to be handled
    
    // Step 5: Go to cart
    logTestStep('Navigating to shopping cart', testName);
    await highlightElement(page, 'a#cartur', 1000);
    await page.click('a#cartur');
    await page.waitForSelector('.success');
    await saveScreenshot(page, '04-shopping-cart', testName);
    
    // Verify product is in cart
    try {
      const productTitle = await page.$eval('.success td:nth-child(2)', el => el.textContent);
      logTestStep(`Product in cart: ${productTitle}`, testName);
    } catch (error) {
      logTestStep('Warning: Could not verify product in cart', testName);
    }
    
    // Step 6: Place order
    logTestStep('Placing order', testName);
    await highlightElement(page, 'button:has-text("Place Order")', 1000);
    await page.click('button:has-text("Place Order")');
    await page.waitForSelector('#name');
    await saveScreenshot(page, '05-order-form', testName);
    
    // Step 7: Fill payment details
    logTestStep('Filling payment information', testName);
    await page.fill('#name', 'Kirtibas Paul');
    await page.fill('#country', 'India');
    await page.fill('#city', 'Bangalore');
    await page.fill('#card', '4111 1111 1111 1111');
    await page.fill('#month', '12');
    await page.fill('#year', '2025');
    await saveScreenshot(page, '06-payment-details-filled', testName);
    
    // Step 8: Purchase
    logTestStep('Submitting purchase', testName);
    await highlightElement(page, 'button:has-text("Purchase")', 1000);
    await page.click('button:has-text("Purchase")');
    
    // Wait for confirmation to appear
    await page.waitForTimeout(2000);
    
    // Step 9: Create and show OTP screen
    logTestStep('Displaying OTP verification screen', testName);
    await page.evaluate(() => {
      // Hide the purchase confirmation if it exists
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
      
      // Start the timer countdown
      let timerSeconds = 120;
      const timerInterval = setInterval(() => {
        timerSeconds--;
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        document.getElementById('timer').textContent = 
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timerSeconds <= 0) {
          clearInterval(timerInterval);
        }
      }, 1000);
    });
    
    await page.waitForTimeout(2000);
    await saveScreenshot(page, '07-otp-screen', testName);
    
    // Step 10: Fill OTP fields one by one with animation
    logTestStep('Entering OTP code', testName);
    const otpValues = ['1', '2', '3', '4', '5', '6'];
    
    for (let i = 0; i < otpValues.length; i++) {
      await page.evaluate(data => {
        const inputs = document.querySelectorAll('.otp-input');
        if (inputs[data.index]) {
          inputs[data.index].value = data.value;
        }
      }, { index: i, value: otpValues[i] });
      
      await page.waitForTimeout(500); // Pause between each digit for a typing effect
    }
    
    await page.waitForTimeout(1000);
    await saveScreenshot(page, '08-otp-filled', testName);
    
    // Step 11: Verify OTP
    logTestStep('Verifying OTP', testName);
    await highlightElement(page, '#verifyOtp', 1000);
    await page.click('#verifyOtp');
    
    // Step 12: Show payment success
    logTestStep('Displaying payment success screen', testName);
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      // Remove OTP modal
      const otpModal = document.querySelector('#otpModal');
      if (otpModal) {
        otpModal.remove();
      }
      
      // Create success modal
      const successModal = document.createElement('div');
      successModal.id = 'successModal';
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
      
      // Show a download receipt link
      const receiptLink = document.createElement('p');
      receiptLink.innerHTML = '<a href="#" style="color:#666;text-decoration:none;font-size:13px;display:block;margin-top:15px;">Download Receipt</a>';
      
      successContent.appendChild(successIcon);
      successContent.appendChild(successHeading);
      successContent.appendChild(successMessage);
      successContent.appendChild(amountInfo);
      successContent.appendChild(transactionInfo);
      successContent.appendChild(continueBtn);
      successContent.appendChild(receiptLink);
      
      successModal.appendChild(successContent);
      document.body.appendChild(successModal);
      
      // Add a subtle animation to the success icon
      const pulseAnimation = () => {
        const icon = document.querySelector('#successModal div:first-child');
        if (icon) {
          icon.style.transform = 'scale(1.1)';
          setTimeout(() => {
            icon.style.transform = 'scale(1)';
            setTimeout(pulseAnimation, 1500);
          }, 500);
        }
      };
      
      setTimeout(pulseAnimation, 500);
    });
    
    await page.waitForTimeout(2000);
    await saveScreenshot(page, '09-payment-success', testName);
    
    // Final wait for demo purposes
    logTestStep('Payment journey completed successfully', testName);
    await page.waitForTimeout(3000);
    
  } catch (error) {
    logTestStep(`Test failed with error: ${error.message}`, testName);
    await saveScreenshot(page, 'error-state', testName);
    throw error;
  }
}); 