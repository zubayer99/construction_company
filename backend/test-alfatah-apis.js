const http = require('http');

// Test Al Fatah Enterprise Business API endpoints
function testAlFatahApis() {
    console.log('🏭 Testing Al Fatah Enterprise Business APIs...\n');
    console.log('=' .repeat(60));
    
    const tests = [
        { name: 'Health Check', path: '/health' },
        { name: 'Company Information', path: '/api/v1/company' },
        { name: 'Services Portfolio', path: '/api/v1/services' },
        { name: 'Projects Showcase', path: '/api/v1/projects' },
        { name: 'Team Members', path: '/api/v1/team' },
        { name: 'Client Testimonials', path: '/api/v1/testimonials' },
        { name: 'Blog Posts', path: '/api/v1/blog/posts' },
        { name: 'Blog Categories', path: '/api/v1/blog/categories' },
        { name: 'Contact Inquiry (GET)', path: '/api/v1/contact' }
    ];
    
    const results = [];
    let completedTests = 0;
    const startTime = Date.now();
    
    tests.forEach((test, index) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: test.path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 5000
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                completedTests++;
                const success = res.statusCode === 200;
                let responseData = null;
                
                try {
                    responseData = JSON.parse(data);
                } catch (e) {
                    responseData = data;
                }
                
                results[index] = {
                    ...test,
                    status: success ? '✅ PASS' : `❌ FAIL (${res.statusCode})`,
                    statusCode: res.statusCode,
                    success,
                    dataLength: data.length,
                    hasData: success && responseData && (Array.isArray(responseData) ? responseData.length > 0 : Object.keys(responseData).length > 0)
                };
                
                if (completedTests === tests.length) {
                    printResults(results, startTime);
                }
            });
        });
        
        req.on('error', (err) => {
            completedTests++;
            results[index] = {
                ...test,
                status: `❌ ERROR: ${err.code || err.message}`,
                success: false,
                error: err.message
            };
            
            if (completedTests === tests.length) {
                printResults(results, startTime);
            }
        });
        
        req.on('timeout', () => {
            req.destroy();
            completedTests++;
            results[index] = {
                ...test,
                status: '❌ TIMEOUT',
                success: false,
                error: 'Request timeout'
            };
            
            if (completedTests === tests.length) {
                printResults(results, startTime);
            }
        });
        
        req.end();
    });
}

function printResults(results, startTime) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n🏭 AL FATAH ENTERPRISE API TEST RESULTS');
    console.log('=' .repeat(60));
    
    results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.name}`);
        console.log(`   Path: ${result.path}`);
        console.log(`   Status: ${result.status}`);
        
        if (result.success && result.hasData !== undefined) {
            console.log(`   Data: ${result.hasData ? '✅ Contains data' : '⚠️ Empty response'}`);
        }
        
        if (result.error) {
            console.log(`   Error: ${result.error}`);
        }
        
        console.log('');
    });
    
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.length - passedTests;
    
    console.log('SUMMARY');
    console.log('=' .repeat(30));
    console.log(`✅ Passed: ${passedTests}/${results.length}`);
    console.log(`❌ Failed: ${failedTests}/${results.length}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    
    if (passedTests === results.length) {
        console.log('\n🎉 All Al Fatah Enterprise APIs are working correctly!');
        console.log('💼 Business services are ready for client integration.');
    } else {
        console.log('\n⚠️ Some APIs are not responding correctly.');
        console.log('🔧 Please check the backend server and database connection.');
    }
    
    console.log('\n📊 Next Steps:');
    console.log('1. Test POST endpoints (contact form, newsletter subscription)');
    console.log('2. Verify frontend integration with these APIs');
    console.log('3. Check data population in database');
    console.log('4. Test complete user flow from frontend to backend');
}

// Test Newsletter Subscription endpoint
function testNewsletterSubscription() {
    console.log('\n📧 Testing Newsletter Subscription...');
    
    const postData = JSON.stringify({
        email: 'test@alfatahenterprise.ae',
        firstName: 'Test',
        lastName: 'User'
    });
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/newsletter/subscribe',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`Newsletter Status: ${res.statusCode === 201 ? '✅ SUCCESS' : `❌ FAILED (${res.statusCode})`}`);
            console.log(`Response: ${data.substring(0, 200)}...`);
        });
    });
    
    req.on('error', (err) => {
        console.log(`❌ Newsletter Error: ${err.message}`);
    });
    
    req.write(postData);
    req.end();
}

// Test Contact Form endpoint
function testContactForm() {
    console.log('\n📞 Testing Contact Form...');
    
    const postData = JSON.stringify({
        name: 'Test Customer',
        email: 'customer@company.com',
        company: 'Test Company Ltd',
        phone: '+971501234567',
        subject: 'Equipment Inquiry',
        message: 'Interested in industrial equipment for our project.',
        services: ['industrial-equipment', 'maintenance']
    });
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/contact',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`Contact Form Status: ${res.statusCode === 201 ? '✅ SUCCESS' : `❌ FAILED (${res.statusCode})`}`);
            console.log(`Response: ${data.substring(0, 200)}...`);
        });
    });
    
    req.on('error', (err) => {
        console.log(`❌ Contact Form Error: ${err.message}`);
    });
    
    req.write(postData);
    req.end();
}

// Main execution
console.log('🚀 Starting Al Fatah Enterprise API Testing Suite...\n');

// Test GET endpoints first
testAlFatahApis();

// Wait a bit then test POST endpoints
setTimeout(() => {
    testNewsletterSubscription();
    testContactForm();
}, 2000);
