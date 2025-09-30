// Test script for AI symptom analysis
// Run with: node test-ai-symptoms.js

const testSymptoms = [
  {
    symptoms: ["fever", "headache"],
    description: "I have been feeling very hot and my head hurts badly since this morning. The fever seems to be getting worse.",
    language: "en"
  },
  {
    symptoms: ["bleeding", "pain"],
    description: "Heavy bleeding and severe abdominal pain started suddenly",
    language: "en"
  },
  {
    symptoms: ["nausea"],
    description: "আমার খুব বমি বমি ভাব হচ্ছে এবং মাথা ঘোরাচ্ছে",
    language: "bn"
  },
  {
    symptoms: [],
    description: "I feel tired and have some mild discomfort, nothing too serious",
    language: "en"
  }
]

async function testAPI() {
  const baseUrl = "http://localhost:3000"
  
  console.log("Testing AI Symptom Analysis API...\n")
  
  for (let i = 0; i < testSymptoms.length; i++) {
    const test = testSymptoms[i]
    console.log(`Test ${i + 1}:`)
    console.log(`Symptoms: ${test.symptoms.join(", ") || "None"}`)
    console.log(`Description: ${test.description}`)
    console.log(`Language: ${test.language}`)
    
    try {
      const response = await fetch(`${baseUrl}/api/analyze-symptoms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(test)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        console.log("✅ Analysis successful")
        console.log(`Urgency: ${result.data.urgency}`)
        console.log(`Severity: ${result.data.severity}`)
        console.log(`Risk Level: ${result.data.riskLevel}`)
        console.log(`AI Generated: ${result.data.aiGenerated}`)
        console.log(`Message: ${result.data.message.en}`)
        if (result.fallbackUsed) {
          console.log("⚠️  Fallback analysis used")
        }
      } else {
        console.log("❌ Analysis failed:", result.error)
      }
      
    } catch (error) {
      console.log("❌ Request failed:", error.message)
    }
    
    console.log("-".repeat(50))
  }
}

// Run the test if this file is executed directly
if (typeof window === "undefined") {
  testAPI().catch(console.error)
}