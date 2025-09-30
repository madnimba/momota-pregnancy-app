// Test Groq AI Integration
// Run with: node test-groq-integration.js (after setting GROQ_API_KEY)

const testCases = [
  {
    name: "English - Mild Symptoms",
    symptoms: ["nausea", "fatigue"],
    description: "I'm feeling a bit nauseous and tired today. It's my second trimester.",
    language: "en"
  },
  {
    name: "Bengali - Urgent Symptoms", 
    symptoms: ["bleeding", "severe-pain"],
    description: "আমার ভারী রক্তপাত হচ্ছে এবং পেটে তীব্র ব্যথা। খুবই চিন্তিত।",
    language: "bn"
  },
  {
    name: "Mixed Language",
    symptoms: ["fever", "headache"],
    description: "I have জ্বর and মাথাব্যথা for 2 days. Getting worried about my baby.",
    language: "en"
  },
  {
    name: "English - Complex Description",
    symptoms: [],
    description: "I've been experiencing unusual discharge, some cramping, and occasional dizziness. This is my first pregnancy and I'm not sure what's normal.",
    language: "en"
  }
]

async function testGroqIntegration() {
  console.log("🧪 Testing Groq AI Integration for Pregnancy Health Analysis\n")
  
  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i]
    console.log(`📋 Test ${i + 1}: ${test.name}`)
    console.log(`   Symptoms: ${test.symptoms.join(", ") || "None selected"}`)
    console.log(`   Description: ${test.description}`)
    console.log(`   Language: ${test.language}`)
    
    try {
      const startTime = Date.now()
      
      const response = await fetch("http://localhost:3000/api/analyze-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(test)
      })
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.data) {
        console.log(`   ✅ Success (${responseTime}ms)`)
        console.log(`   🤖 AI Generated: ${result.data.aiGenerated}`)
        console.log(`   ⚠️  Urgency: ${result.data.urgency.toUpperCase()}`)
        console.log(`   📊 Severity: ${result.data.severity}`)
        console.log(`   🎯 Risk Level: ${result.data.riskLevel}`)
        console.log(`   🔍 Confidence: ${(result.data.confidence * 100).toFixed(1)}%`)
        
        if (test.language === "bn") {
          console.log(`   💬 Message (Bengali): ${result.data.message.bn}`)
        } else {
          console.log(`   💬 Message: ${result.data.message.en}`)
        }
        
        if (result.data.recommendations[test.language].length > 0) {
          console.log(`   📝 Recommendations:`)
          result.data.recommendations[test.language].forEach((rec, idx) => {
            console.log(`      ${idx + 1}. ${rec}`)
          })
        }
        
        if (result.fallbackUsed) {
          console.log(`   ⚠️  Note: Fallback analysis used (AI unavailable)`)
        }
      } else {
        console.log(`   ❌ Failed: ${result.error}`)
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    console.log("   " + "-".repeat(60))
  }
  
  console.log("\n🎯 Test completed!")
  console.log("\n💡 To get the full AI experience:")
  console.log("   1. Get your free Groq API key from https://console.groq.com/keys")
  console.log("   2. Add it to your .env.local file: GROQ_API_KEY=gsk_your_key_here")
  console.log("   3. Restart your dev server and test again!")
}

// Only run if this file is executed directly
if (typeof window === "undefined" && require.main === module) {
  testGroqIntegration().catch(console.error)
}

module.exports = { testGroqIntegration }