// Comprehensive API Integration Test
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

// Test configuration
const tests = [
  { name: 'Health Check', url: '/health' },
  { name: 'Company Info', url: '/api/v1/company' },
  { name: 'Services', url: '/api/v1/services' },
  { name: 'Projects', url: '/api/v1/projects' },
  { name: 'Team Members', url: '/api/v1/team' },
  { name: 'Testimonials', url: '/api/v1/testimonials' },
  { name: 'Blog Posts', url: '/api/v1/blog/posts' },
  { name: 'Blog Categories', url: '/api/v1/blog/categories' },
];

async function runTests() {
  console.log('🚀 Starting API Integration Tests...\n');
  
  const results = [];
  
  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      const response = await axios.get(`${API_BASE}${test.url}`);
      
      console.log(`✅ ${test.name}: SUCCESS (${response.status})`);
      console.log(`   Data length: ${JSON.stringify(response.data).length} characters`);
      
      results.push({
        name: test.name,
        status: 'SUCCESS',
        statusCode: response.status,
        dataLength: JSON.stringify(response.data).length,
        error: null
      });
    } catch (error) {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   Error: ${error.message}`);
      
      results.push({
        name: test.name,
        status: 'FAILED',
        statusCode: error.response?.status || 'N/A',
        dataLength: 0,
        error: error.message
      });
    }
    console.log('');
  }
  
  // Summary
  console.log('📊 TEST SUMMARY:');
  console.log('================');
  const successful = results.filter(r => r.status === 'SUCCESS').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  
  console.log(`✅ Successful: ${successful}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);
  console.log(`🎯 Success Rate: ${((successful / tests.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.filter(r => r.status === 'FAILED').forEach(test => {
      console.log(`   - ${test.name}: ${test.error}`);
    });
  }
  
  // Test POST endpoints (Contact form)
  console.log('\n🔄 Testing POST endpoints...');
  try {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message from the integration test.',
      serviceInterest: 'IT Solutions'
    };
    
    const contactResponse = await axios.post(`${API_BASE}/api/v1/contact`, contactData);
    console.log(`✅ Contact Form: SUCCESS (${contactResponse.status})`);
  } catch (error) {
    console.log(`❌ Contact Form: FAILED - ${error.message}`);
  }
  
  // Test Newsletter subscription
  try {
    const newsletterData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'newsletter-test@example.com'
    };
    
    const newsletterResponse = await axios.post(`${API_BASE}/api/v1/newsletter/subscribe`, newsletterData);
    console.log(`✅ Newsletter Subscription: SUCCESS (${newsletterResponse.status})`);
  } catch (error) {
    console.log(`❌ Newsletter Subscription: FAILED - ${error.message}`);
  }
  
  console.log('\n🎉 Integration test completed!');
}

// Run the tests
runTests().catch(console.error);
