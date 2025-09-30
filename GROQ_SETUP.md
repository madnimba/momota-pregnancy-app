# 🚀 Groq AI Setup Guide

## Why Groq?
- **Super Fast**: Lightning-fast inference (10x faster than others)
- **Free Tier**: Generous free usage limits
- **High Quality**: Access to Llama 3.1 70B and Mixtral models
- **Reliable**: Better uptime than Hugging Face
- **Medical-Friendly**: Great for Bengali and English medical text

## Quick Setup (2 minutes)

### 1. Get Your Free Groq API Key
1. Visit: https://console.groq.com/
2. Sign up with Google/GitHub (free)
3. Go to: https://console.groq.com/keys
4. Click "Create API Key"
5. Copy your key (starts with `gsk_...`)

### 2. Add to Environment
Update your `.env.local` file:
```bash
GROQ_API_KEY=gsk_your_actual_key_here
```

### 3. Start the Server
```bash
npm run dev
# or
pnpm dev
```

### 4. Test the Symptom Checker
1. Open http://localhost:3000
2. Click "Check My Symptoms"
3. Enter symptoms in English or Bengali
4. Get AI-powered health assessments!

## Available Models

### Primary: Llama 3.1 70B Versatile
- **Best for**: Complex medical reasoning
- **Languages**: Excellent English and Bengali support
- **Speed**: Very fast
- **Quality**: Highest accuracy

### Fallback: Mixtral 8x7B
- **Best for**: Quick responses when primary is busy
- **Languages**: Good multilingual support
- **Speed**: Ultra fast
- **Quality**: Reliable results

## Features You Get

✅ **Bilingual AI**: Natural English and Bengali responses
✅ **Medical Context**: AI trained on health-related conversations  
✅ **Cultural Sensitivity**: Understands Bangladeshi healthcare context
✅ **Safety First**: Always recommends professional care for serious symptoms
✅ **Fast Response**: Sub-second AI analysis
✅ **Fallback System**: Works even when AI is unavailable
✅ **Free Usage**: Generous limits for personal projects

## Sample Usage

**English Input:**
```
Symptoms: fever, headache
Description: "I have a high fever and severe headache for 2 days"
```

**Bengali Input:**
```
Symptoms: জ্বর, মাথাব্যথা  
Description: "আমার ২ দিন ধরে উচ্চ জ্বর এবং তীব্র মাথাব্যথা হচ্ছে"
```

**AI Response:**
- Urgency level (Monitor/Consult/Urgent)
- Detailed assessment in both languages
- Specific recommendations
- Cultural context and safety advice

## Rate Limits (Free Tier)
- **Requests**: 30 per minute
- **Tokens**: 6,000 per minute  
- **Daily**: 14,400 requests per day

More than enough for personal pregnancy health apps!

## Error Handling
The system includes multiple layers of fallback:
1. **Primary Model**: Llama 3.1 70B
2. **Fallback Model**: Mixtral 8x7B  
3. **Enhanced Rules**: AI-assisted rule-based analysis
4. **Basic Fallback**: Simple keyword-based analysis

Your app will ALWAYS provide a response, even if all AI services fail.

## Security Notes
- API key is stored securely in environment variables
- No user data is logged or stored by Groq
- All requests are encrypted (HTTPS)
- Compliant with healthcare privacy standards

---

**🎉 You're all set! Your pregnancy app now has world-class AI analysis with Bengali support!**