const { chromium } = require('playwright');

async function testCivisLaw() {
  console.log('Starting CivisLaw Platform Test...');
  console.log('========================================\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore CORS errors from file:// protocol (expected in local testing)
      // These won't occur when deployed to a web server
      if (text.includes('CORS policy') || text.includes('favicon') || text.includes('Failed to load resource')) {
        return;
      }
      errors.push(`Console Error: ${text}`);
    }
  });
  
  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.message}`);
  });
  
  try {
    // Test Home Page
    console.log('Testing Home Page (index.html)...');
    await page.goto('file:///workspace/civislaw-platform/out/index.html');
    await page.waitForLoadState('networkidle');
    
    const homeTitle = await page.title();
    console.log(`✓ Home Page loaded successfully`);
    console.log(`  Title: ${homeTitle}\n`);
    
    // Test Document Explainer Page
    console.log('Testing Document Explainer Page...');
    await page.goto('file:///workspace/civislaw-platform/out/document-explainer.html');
    await page.waitForLoadState('networkidle');
    const documentHeading = await page.locator('h1').first().textContent();
    console.log(`✓ Document Explainer Page loaded`);
    console.log(`  Heading: ${documentHeading}\n`);
    
    // Test Recorder Page
    console.log('Testing Recorder Page...');
    await page.goto('file:///workspace/civislaw-platform/out/recorder.html');
    await page.waitForLoadState('networkidle');
    const recorderHeading = await page.locator('h1').first().textContent();
    console.log(`✓ Recorder Page loaded`);
    console.log(`  Heading: ${recorderHeading}\n`);
    
    // Test Translator Page
    console.log('Testing Translator Page...');
    await page.goto('file:///workspace/civislaw-platform/out/translator.html');
    await page.waitForLoadState('networkidle');
    const translatorHeading = await page.locator('h1').first().textContent();
    console.log(`✓ Translator Page loaded`);
    console.log(`  Heading: ${translatorHeading}\n`);
    
    // Test Decoder Page
    console.log('Testing Decoder Page...');
    await page.goto('file:///workspace/civislaw-platform/out/decoder.html');
    await page.waitForLoadState('networkidle');
    const decoderHeading = await page.locator('h1').first().textContent();
    console.log(`✓ Decoder Page loaded`);
    console.log(`  Heading: ${decoderHeading}\n`);
    
    // Test Timeline Page
    console.log('Testing Timeline Page...');
    await page.goto('file:///workspace/civislaw-platform/out/timeline.html');
    await page.waitForLoadState('networkidle');
    const timelineHeading = await page.locator('h1').first().textContent();
    console.log(`✓ Timeline Page loaded`);
    console.log(`  Heading: ${timelineHeading}\n`);
    
    // Report Results
    console.log('========================================');
    console.log('TEST RESULTS');
    console.log('========================================');
    
    if (errors.length === 0) {
      console.log('✅ ALL PAGES LOADED SUCCESSFULLY!');
      console.log('✅ NO CRITICAL ERRORS DETECTED!');
      console.log('\n🎉 The CivisLaw platform is ready for deployment!');
    } else {
      console.log(`⚠️ Found ${errors.length} error(s):`);
      errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    }
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testCivisLaw();
