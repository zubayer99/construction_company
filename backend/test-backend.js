const http = require('http');

// Test backend connectivity
function testBackend() {
    console.log('🔍 Testing Al Fatah Enterprise Backend...\n');
    
    const tests = [
        { name: 'Health Check', path: '/health' },
        { name: 'Company Info', path: '/api/v1/company' },
        { name: 'Services', path: '/api/v1/services' },
        { name: 'Projects', path: '/api/v1/projects' },
        { name: 'Testimonials', path: '/api/v1/testimonials' },
        { name: 'Team', path: '/api/v1/team' },
        { name: 'Blog Posts', path: '/api/v1/blog/posts' }
    ];
    
    const results = [];
    let completedTests = 0;
    
    tests.forEach((test, index) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: test.path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                completedTests++;
                const success = res.statusCode === 200;
                results[index] = {
                    ...test,
                    status: success ? '✅ PASS' : `❌ FAIL (${res.statusCode})`,
                    success
                };
                
                if (completedTests === tests.length) {
                    printResults(results);
                }
            });
        });
        
        req.on('error', (err) => {
            completedTests++;
            results[index] = {
                ...test,
                status: `❌ ERROR: ${err.message}`,
                success: false
            };
            
            if (completedTests === tests.length) {
                printResults(results);
            }
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            completedTests++;
            results[index] = {
                ...test,
                status: '❌ TIMEOUT',
                success: false
            };
            
            if (completedTests === tests.length) {
                printResults(results);
            }
        });
        
        req.end();
    });
}

function printResults(results) {
    console.log('🧪 Backend API Test Results:');
    console.log('================================\n');
    
    results.forEach(result => {
        console.log(`${result.status} ${result.name} (${result.path})`);
    });
    
    const passedTests = results.filter(r => r.success).length;
    const totalTests = results.length;
    
    console.log(`\n📊 Summary: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! Backend is fully functional for Al Fatah Enterprise.');
    } else {
        console.log('\n⚠️  Some tests failed. Backend may need configuration.');
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Check if backend server is running on port 3001');
        console.log('2. Verify database connection');
        console.log('3. Ensure sample data is populated');
        console.log('4. Check backend logs for errors');
    }
}

// Start the test
testBackend();
