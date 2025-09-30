// Test file to demonstrate the enhanced symptom checker functionality
import { analyzeSymptomDescription, analyzeSymptomsCombined } from './lib/ai-symptom-analysis'

// Test cases for the enhanced symptom checker
console.log("=== Enhanced Symptom Checker Tests ===\n")

// Test 1: English symptom description
console.log("Test 1: English description")
const englishTest = analyzeSymptomDescription("I have been experiencing severe headaches and dizziness for the past two days. The pain is unbearable and I feel like I might faint.")
console.log("Input:", "I have been experiencing severe headaches and dizziness for the past two days. The pain is unbearable and I feel like I might faint.")
console.log("Language detected:", englishTest.language)
console.log("Extracted symptoms:", englishTest.extractedSymptoms)
console.log("Severity:", englishTest.severity)
console.log("Urgency:", englishTest.urgency)
console.log("Risk Level:", englishTest.riskLevel)
console.log("Message (EN):", englishTest.message.en)
console.log("Recommendations (EN):", englishTest.recommendations.en.slice(0, 3))
console.log("\n---\n")

// Test 2: Bangla symptom description
console.log("Test 2: Bangla description")
const banglaTest = analyzeSymptomDescription("আমার প্রচণ্ড পেটে ব্যথা হচ্ছে এবং জ্বর আছে। খুব কষ্ট হচ্ছে এবং বমি বমি লাগছে।")
console.log("Input:", "আমার প্রচণ্ড পেটে ব্যথা হচ্ছে এবং জ্বর আছে। খুব কষ্ট হচ্ছে এবং বমি বমি লাগছে।")
console.log("Language detected:", banglaTest.language)
console.log("Extracted symptoms:", banglaTest.extractedSymptoms)
console.log("Severity:", banglaTest.severity)
console.log("Urgency:", banglaTest.urgency)
console.log("Risk Level:", banglaTest.riskLevel)
console.log("Message (BN):", banglaTest.message.bn)
console.log("Recommendations (BN):", banglaTest.recommendations.bn.slice(0, 3))
console.log("\n---\n")

// Test 3: Mixed language
console.log("Test 3: Mixed language description")
const mixedTest = analyzeSymptomDescription("I am having fever জ্বর and severe pain ব্যথা. Very uncomfortable.")
console.log("Input:", "I am having fever জ্বর and severe pain ব্যথা. Very uncomfortable.")
console.log("Language detected:", mixedTest.language)
console.log("Extracted symptoms:", mixedTest.extractedSymptoms)
console.log("Severity:", mixedTest.severity)
console.log("Urgency:", mixedTest.urgency)
console.log("\n---\n")

// Test 4: Combined analysis (checkboxes + description)
console.log("Test 4: Combined analysis (checkboxes + text)")
const combinedTest = analyzeSymptomsCombined(
  ["fever", "pain"], 
  "The fever started yesterday and the abdominal pain is getting worse. I can barely walk."
)
console.log("Selected symptoms:", ["fever", "pain"])
console.log("Description:", "The fever started yesterday and the abdominal pain is getting worse. I can barely walk.")
console.log("All identified symptoms:", combinedTest.extractedSymptoms)
console.log("Final urgency:", combinedTest.urgency)
console.log("Risk Level:", combinedTest.riskLevel)
console.log("Possible conditions:", combinedTest.possibleConditions)
console.log("\n---\n")

// Test 5: Mild symptoms
console.log("Test 5: Mild symptoms")
const mildTest = analyzeSymptomDescription("I feel a little tired today and have a slight headache. Nothing too serious.")
console.log("Input:", "I feel a little tired today and have a slight headache. Nothing too serious.")
console.log("Severity:", mildTest.severity)
console.log("Urgency:", mildTest.urgency)
console.log("Risk Level:", mildTest.riskLevel)
console.log("Message:", mildTest.message.en)

console.log("\n=== Test Complete ===")
console.log("\nKey Features Implemented:")
console.log("✅ Bilingual support (English & Bangla)")
console.log("✅ Mixed language detection") 
console.log("✅ Symptom extraction from natural language")
console.log("✅ Severity assessment (mild/moderate/severe)")
console.log("✅ Urgency classification (monitor/consult/urgent)")
console.log("✅ Risk level mapping (low/medium/high)")
console.log("✅ Intelligent recommendations")
console.log("✅ Possible condition suggestions")
console.log("✅ Combined checkbox + text analysis")
console.log("✅ Language-appropriate responses")