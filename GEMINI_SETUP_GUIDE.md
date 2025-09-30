# Gemini AI Integration Setup Guide

## 🚀 Complete Migration from Groq to Gemini AI

Your pregnancy health app now uses **Google Gemini 2.0 Flash** for all image analysis! This provides:

- ✅ **Free tier** with generous limits
- ✅ **Superior image analysis** capabilities  
- ✅ **Direct patient communication** (addresses "you" not "the patient")
- ✅ **Bengali/English bilingual** responses
- ✅ **Pregnancy-focused** health guidance

## 🔑 Environment Variables Required

Add these to your `.env.local` file:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Keep Groq for text symptom analysis (if you want)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

## 🔧 How to Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" 
4. Create new project or use existing
5. Copy the API key
6. Add to `.env.local` as `GEMINI_API_KEY=your_key_here`

## 📱 What's Now Using Gemini

### Image Analysis Tools:
- **Anemia Detection** - Analyze nail/lip/eye photos
- **Nutrition Analysis** - Analyze meal photos  
- **Blood Pressure** - Read BP monitor displays
- **Infection Detection** - Analyze skin/eye conditions
- **Diabetes Management** - Read glucose meter displays

### API Endpoints:
- `/api/analyze-anemia` ✅ Gemini
- `/api/analyze-nutrition` ✅ Gemini  
- `/api/analyze-bp` ✅ Gemini
- `/api/analyze-infection` ✅ Gemini
- `/api/analyze-diabetes` ✅ Gemini

### Text Analysis (Still Groq):
- `/api/analyze-symptoms` - Text symptom analysis

## 🎯 Key Features

### Personal Communication:
- **Before**: "রোগীর জ্বর এবং বমি বমি ভাব হচ্ছে" (The patient has fever and nausea)
- **After**: "আপনার জ্বর এবং বমি বমি ভাব হচ্ছে" (You have fever and nausea)

### Advanced Image Analysis:
- **OCR Reading**: Can read numbers from BP/glucose monitors
- **Visual Assessment**: Analyzes color, texture, condition  
- **Medical Knowledge**: Pregnancy-specific health insights
- **Cultural Sensitivity**: Understands Bengali/South Asian context

### Safety First:
- Always recommends consulting healthcare providers
- Focuses on pregnancy-safe recommendations
- Distinguishes urgent vs non-urgent conditions
- Provides fallback analysis if API fails

## 🔄 Testing Your Integration

1. **Start the app**: `pnpm run dev`
2. **Go to**: `http://localhost:3001/tools/anemia`
3. **Test anemia detection**:
   - Upload nail/lip/eye photo
   - Click "Analyze"
   - Should get Gemini AI response
4. **Test nutrition analysis**:
   - Switch to "Meal Analysis" tab
   - Upload food photo  
   - Should get detailed nutritional breakdown

## 💡 Benefits of Gemini vs Groq for Images

| Feature | Groq | Gemini 2.0 Flash |
|---------|------|------------------|
| Image Analysis | ❌ Limited | ✅ Excellent |
| OCR Reading | ❌ Basic | ✅ Advanced |
| Free Tier | ✅ Good | ✅ Generous |
| Response Speed | ✅ Fast | ✅ Fast |
| Bengali Support | ✅ Good | ✅ Excellent |
| Medical Knowledge | ✅ Good | ✅ Superior |

## 🎉 What Users Will Experience

### Anemia Tool:
- Upload photo of nail/lip/eye
- Get AI analysis: "আপনার রক্তস্বল্পতার মাঝারি ঝুঁকি রয়েছে" (You have moderate anemia risk)
- Personal recommendations directly addressed to them

### Nutrition Tool:
- Upload meal photo
- Get detailed breakdown: Iron, Protein, Calcium, Calories
- Personal dietary advice: "আপনার আয়রন বাড়ানো প্রয়োজন" (You need to increase iron)

### BP Tool:
- Upload BP monitor photo
- Get reading analysis with preeclampsia risk assessment
- Direct guidance: "আপনার রক্তচাপ কিছুটা বেশি" (Your blood pressure is slightly elevated)

## 🔧 Troubleshooting

### If Gemini API fails:
- App automatically uses fallback analysis
- Check API key in `.env.local`
- Verify internet connection
- Check browser console for errors

### API Rate Limits:
- Gemini has generous free tier
- Built-in fallback system
- Graceful error handling

Your app is now powered by state-of-the-art Gemini AI for image analysis while maintaining the exact same user experience! 🚀