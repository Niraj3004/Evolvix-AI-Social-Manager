const { config } = require('dotenv');

config();

async function testConnections() {
    console.log("--- Starting AI API Checks ---");
    
    // 1. Test Gemini
    try {
        console.log("\nTesting Gemini API...");
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        if (res.ok) {
            console.log("✅ Gemini API is working successfully!");
        } else {
            console.log(`❌ Gemini API failed (Status: ${res.status})`);
        }
    } catch (e) {
        console.log("❌ Gemini API check failed:", e.message);
    }

    // 2. Test Groq
    try {
        console.log("\nTesting Groq API...");
        const res = await fetch('https://api.groq.com/openai/v1/models', {
            headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
        });
        if (res.ok) {
            console.log("✅ Groq API is working successfully!");
        } else {
            console.log(`❌ Groq API failed (Status: ${res.status})`);
        }
    } catch (e) {
        console.log("❌ Groq API check failed:", e.message);
    }

    // 3. Test OpenRouter
    try {
        console.log("\nTesting OpenRouter API...");
        const res = await fetch('https://openrouter.ai/api/v1/models', {
            headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
        });
        if (res.ok) {
            console.log("✅ OpenRouter API is working successfully!");
        } else {
            console.log(`❌ OpenRouter API failed (Status: ${res.status})`);
        }
    } catch (e) {
        console.log("❌ OpenRouter API check failed:", e.message);
    }

    // 4. Test OpenAI
    try {
        console.log("\nTesting OpenAI API...");
        const res = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
        });
        if (res.ok) {
            console.log("✅ OpenAI API is working successfully!");
        } else {
            console.log(`❌ OpenAI API failed (Status: ${res.status})`);
        }
    } catch (e) {
        console.log("❌ OpenAI API check failed:", e.message);
    }
}

testConnections();
