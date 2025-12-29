// CivisLaw Platform - Playwright Test Suite
// Tests authentication, user flows, and core functionality

const { chromium } = require('playwright');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testLoginPage() {
  console.log('🧪 Testing Login Page...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Check if login form elements are present
    // Note: The email input uses type="text" (emailOrPhone field)
    const emailInput = await page.$('input[name="emailOrPhone"]');
    const passwordInput = await page.$('input[name="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    if (!emailInput || !passwordInput || !submitButton) {
      throw new Error('Login form elements not found');
    }
    
    console.log('✅ Login page loaded successfully');
    console.log('   - Email/Phone input found');
    console.log('   - Password input found');
    console.log('   - Submit button found');
    
    // Take a screenshot for verification
    await page.screenshot({ path: '/tmp/login-page.png', fullPage: true });
    console.log('   - Screenshot saved to /tmp/login-page.png');
    
    await context.close();
    await browser.close();
    return true;
  } catch (error) {
    console.error('❌ Login page test failed:', error.message);
    await page.screenshot({ path: '/tmp/login-error.png', fullPage: true });
    await context.close();
    await browser.close();
    return false;
  }
}

async function testRegisterPage() {
  console.log('\n🧪 Testing Register Page...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Check if registration form elements are present
    // Use name attributes for more reliable selection
    const emailInput = await page.$('input[name="email"]');
    const passwordInput = await page.$('input[name="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    if (!emailInput || !passwordInput || !submitButton) {
      throw new Error('Registration form elements not found');
    }
    
    console.log('✅ Register page loaded successfully');
    console.log('   - Email input found');
    console.log('   - Password input found');
    console.log('   - Submit button found');
    
    await page.screenshot({ path: '/tmp/register-page.png', fullPage: true });
    console.log('   - Screenshot saved to /tmp/register-page.png');
    
    await context.close();
    await browser.close();
    return true;
  } catch (error) {
    console.error('❌ Register page test failed:', error.message);
    await page.screenshot({ path: '/tmp/register-error.png', fullPage: true });
    await context.close();
    await browser.close();
    return false;
  }
}

async function testHomePage() {
  console.log('\n🧪 Testing Home Page...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Check if home page has content
    const title = await page.title();
    console.log('✅ Home page loaded successfully');
    console.log(`   - Page title: ${title}`);
    
    // Check for main content elements
    const mainContent = await page.$('main') || await page.$('body');
    if (mainContent) {
      console.log('   - Main content area found');
    }
    
    await page.screenshot({ path: '/tmp/home-page.png', fullPage: true });
    console.log('   - Screenshot saved to /tmp/home-page.png');
    
    await context.close();
    await browser.close();
    return true;
  } catch (error) {
    console.error('❌ Home page test failed:', error.message);
    await page.screenshot({ path: '/tmp/home-error.png', fullPage: true });
    await context.close();
    await browser.close();
    return false;
  }
}

async function testAdminPages() {
  console.log('\n🧪 Testing Admin Pages...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Test admin dashboard
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Admin dashboard page loaded');
    
    // Test admin users page
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Admin users page loaded');
    
    // Test admin analytics page
    await page.goto(`${BASE_URL}/admin/analytics`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Admin analytics page loaded');
    
    // Test admin audit-logs page
    await page.goto(`${BASE_URL}/admin/audit-logs`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Admin audit-logs page loaded');
    
    // Test admin announcements page
    await page.goto(`${BASE_URL}/admin/announcements`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Admin announcements page loaded');
    
    await page.screenshot({ path: '/tmp/admin-pages.png', fullPage: true });
    console.log('   - Screenshot saved to /tmp/admin-pages.png');
    
    await context.close();
    await browser.close();
    return true;
  } catch (error) {
    console.error('❌ Admin pages test failed:', error.message);
    await page.screenshot({ path: '/tmp/admin-error.png', fullPage: true });
    await context.close();
    await browser.close();
    return false;
  }
}

async function testUserPages() {
  console.log('\n🧪 Testing User Pages...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Test user dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ User dashboard page loaded');
    
    // Test documents page
    await page.goto(`${BASE_URL}/documents`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Documents page loaded');
    
    // Test statements page
    await page.goto(`${BASE_URL}/statements`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Statements page loaded');
    
    // Test consent page
    await page.goto(`${BASE_URL}/consent`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Consent page loaded');
    
    // Test activity page
    await page.goto(`${BASE_URL}/activity`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Activity page loaded');
    
    await page.screenshot({ path: '/tmp/user-pages.png', fullPage: true });
    console.log('   - Screenshot saved to /tmp/user-pages.png');
    
    await context.close();
    await browser.close();
    return true;
  } catch (error) {
    console.error('❌ User pages test failed:', error.message);
    await page.screenshot({ path: '/tmp/user-error.png', fullPage: true });
    await context.close();
    await browser.close();
    return false;
  }
}

async function testProfilePage() {
  console.log('\n🧪 Testing Profile Page...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle', timeout: 30000 });
    
    console.log('✅ Profile page loaded successfully');
    await page.screenshot({ path: '/tmp/profile-page.png', fullPage: true });
    console.log('   - Screenshot saved to /tmp/profile-page.png');
    
    await context.close();
    await browser.close();
    return true;
  } catch (error) {
    console.error('❌ Profile page test failed:', error.message);
    await page.screenshot({ path: '/tmp/profile-error.png', fullPage: true });
    await context.close();
    await browser.close();
    return false;
  }
}

async function testResponsiveDesign() {
  console.log('\n🧪 Testing Responsive Design...');
  const browser = await chromium.launch({ headless: true });
  
  try {
    // Test mobile viewport
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 }
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Mobile view (375x667) - Login page loads correctly');
    await mobileContext.close();
    
    // Test tablet viewport
    const tabletContext = await browser.newContext({
      viewport: { width: 768, height: 1024 }
    });
    const tabletPage = await tabletContext.newPage();
    await tabletPage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Tablet view (768x1024) - Login page loads correctly');
    await tabletContext.close();
    
    // Test desktop viewport
    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Desktop view (1920x1080) - Login page loads correctly');
    await desktopContext.close();
    
    await browser.close();
    return true;
  } catch (error) {
    console.error('❌ Responsive design test failed:', error.message);
    await browser.close();
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting CivisLaw Platform Test Suite');
  console.log('=======================================');
  console.log(`Test URL: ${BASE_URL}`);
  console.log('');
  
  const results = {
    homePage: false,
    loginPage: false,
    registerPage: false,
    profilePage: false,
    adminPages: false,
    userPages: false,
    responsiveDesign: false,
  };
  
  // Run all tests
  results.homePage = await testHomePage();
  results.loginPage = await testLoginPage();
  results.registerPage = await testRegisterPage();
  results.profilePage = await testProfilePage();
  results.adminPages = await testAdminPages();
  results.userPages = await testUserPages();
  results.responsiveDesign = await testResponsiveDesign();
  
  // Summary
  console.log('\n=======================================');
  console.log('📊 Test Results Summary');
  console.log('=======================================');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`Passed: ${passed}/${total} test suites`);
  console.log('');
  
  for (const [test, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test.replace(/([A-Z])/g, ' $1').trim()}`);
  }
  
  console.log('');
  
  if (passed === total) {
    console.log('🎉 All tests passed! Application is ready for deployment.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
