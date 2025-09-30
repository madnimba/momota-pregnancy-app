# AI Health Symptom Analysis Setup

This implementation adds real AI-powered symptom analysis to the Momota pregnancy app using free AI services.

## 🚀 Quick Setup

### 1. Choose Your AI Service

**Option A: Hugging Face (Recommended - Free)**
1. Go to [Hugging Face](https://huggingface.co/) and create a free account
2. Visit [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Create a new token with "Read" permissions
4. Copy the token and add it to your `.env.local` file:

```bash
HUGGINGFACE_API_TOKEN=hf_your_token_here
```

**Option B: Ollama (Local AI)**
1. Install [Ollama](https://ollama.ai/) locally
2. Run: `ollama pull llama2` or another medical-focused model
3. Start Ollama: `ollama serve`
4. Set the URL in `.env.local`:

```bash
OLLAMA_API_URL=http://localhost:11434
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

### 4. Test the Integration

**Option A: Use the Web Interface**
1. Open http://localhost:3000
2. Click "Check My Symptoms"
3. Select symptoms and/or enter a description
4. Click "Analyze Symptoms"

**Option B: Test the API Directly**
```bash
node test-ai-symptoms.js
```

## 🔧 How It Works

### Architecture

1. **Frontend** (`app/page.tsx`): User interface for symptom input
2. **Client Service** (`lib/symptom-analysis-client.ts`): Handles API calls from browser
3. **API Route** (`app/api/analyze-symptoms/route.ts`): Server-side endpoint
4. **AI Service** (`lib/health-ai-service.ts`): Core AI integration and fallback logic

### AI Integration

The system uses a **multi-layered approach**:

1. **Primary**: Hugging Face free AI models for natural language processing
2. **Enhanced Fallback**: Intelligent rule-based analysis with AI context
3. **Basic Fallback**: Simple keyword-based analysis if AI fails

### Prompt Engineering

The AI is specifically prompted for:
- Pregnancy-related health concerns
- Culturally appropriate responses (Bangladeshi context)
- Bilingual support (English/Bengali)
- Medical safety (always recommends professional care for serious symptoms)

## 🛡️ Safety Features

- **Urgent Symptom Detection**: Automatically flags dangerous symptoms
- **Professional Disclaimer**: Always recommends consulting healthcare providers
- **Fallback Analysis**: Works even if AI services are unavailable
- **Input Validation**: Sanitizes and validates all user inputs
- **Error Handling**: Graceful degradation on failures

## 🌐 Free AI Services Used

### Hugging Face Inference API
- **Cost**: Free (with rate limits)
- **Models**: Microsoft DialoGPT, GPT-2, and others
- **Limits**: ~1000 requests/month on free tier
- **Pros**: No setup required, good for text analysis
- **Cons**: Rate limited, not medical-specific

### Alternative: Ollama (Local)
- **Cost**: Free (requires local resources)
- **Models**: Llama 2, Mistral, medical-specific models
- **Limits**: Based on your hardware
- **Pros**: Unlimited usage, privacy, medical models available
- **Cons**: Requires installation and local resources

## 🔮 Possible Enhancements

1. **Medical-Specific Models**: Use models trained on medical data
2. **Symptom Context Learning**: Train on pregnancy-specific symptom patterns
3. **Multi-language Models**: Better Bengali language support
4. **Severity Prediction**: ML models for risk assessment
5. **Integration with Medical Databases**: Connect to symptom databases

## 📝 API Documentation

### POST `/api/analyze-symptoms`

**Request Body:**
```json
{
  "symptoms": ["fever", "headache"],
  "description": "Patient description of symptoms",
  "language": "en" // or "bn"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "extractedSymptoms": ["fever", "headache"],
    "severity": "moderate",
    "urgency": "consult",
    "riskLevel": "medium",
    "possibleConditions": ["..."],
    "recommendations": {
      "en": ["..."],
      "bn": ["..."]
    },
    "message": {
      "en": "Assessment message",
      "bn": "মূল্যায়ন বার্তা"
    },
    "confidence": 0.85,
    "aiGenerated": true
  },
  "fallbackUsed": false
}
```

## 🚨 Important Notes

1. **Not a Medical Device**: This is an educational/informational tool only
2. **Professional Care**: Always encourage users to consult healthcare providers
3. **Privacy**: User data should be handled according to healthcare privacy standards
4. **Testing**: Thoroughly test with various symptom combinations
5. **Rate Limits**: Monitor API usage to avoid hitting free tier limits

## 🐛 Troubleshooting

**"AI features will use fallback analysis"**
- Check your `.env.local` file has the correct API token
- Verify the token has proper permissions

**API requests failing**
- Ensure development server is running on port 3000
- Check network connectivity for external AI services

**Empty or poor responses**
- AI models may need warm-up time (first request slower)
- Try different models or adjust prompts in `health-ai-service.ts`

**For production deployment:**
- Add proper rate limiting
- Implement caching for common symptom patterns
- Set up monitoring for AI service availability
- Consider upgrading to paid AI service tiers for better reliability