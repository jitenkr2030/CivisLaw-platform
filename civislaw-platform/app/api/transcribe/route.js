import { NextResponse } from 'next/server';

// Simulated transcription service - in production, use OpenAI Whisper or similar
export async function POST(request) {
  try {
    const body = await request.json();
    const { audioData, language } = body;

    if (!audioData) {
      return NextResponse.json(
        { error: 'Audio data is required' },
        { status: 400 }
      );
    }

    // Simulate transcription delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock transcription - in production, use actual speech-to-text API
    const mockTranscription = {
      text: generateMockTranscript(language),
      confidence: 0.95,
      language: language || 'en',
      duration: 45,
      words: [
        { word: 'My', start: 0, end: 0.5 },
        { word: 'name', start: 0.5, end: 1.0 },
        { word: 'is', start: 1.0, end: 1.5 },
        { word: 'Sita', start: 1.5, end: 2.5 },
        // More words would be here in real implementation
      ]
    };

    // Detect emotional keywords
    const emotionalKeywords = detectEmotionalKeywords(mockTranscription.text);

    return NextResponse.json({
      success: true,
      data: {
        ...mockTranscription,
        emotionalKeywords
      }
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}

function generateMockTranscript(language) {
  if (language === 'hi') {
    return "मेरा नाम सीता है। मैं कल शाम को अपने घर जा रही थी। रास्ते में एक अजनबी ने मेरा पीछा किया। मुझे बहुत डर लगा।";
  }
  if (language === 'ta') {
    return "என்னுடைய பெயர் சீதா. நேற்று மாலை நான் வீட்டிற்கு செல்லுவதாக இருந்தேன். வழியில் ஒரு stranger என்னை follow செய்தான். எனக்கு மிகவும் பயமாக இருந்தது.";
  }
  if (language === 'te') {
    return "నా పేరు సీతా. నిన్నటి సాయంత్రం నేను ఇంటికి వెళ్తున్నాను. రోడ్డుపై ఒక అజ్ఞాత వ్యక్తి నాకు వెనుకబడ్డాడు. నాకు చాలా భయం వచ్చింది.";
  }
  
  // Default English
  return "My name is Sita. Yesterday evening I was going home. On the way, a stranger followed me. I was very scared.";
}

function detectEmotionalKeywords(text) {
  const lowerText = text.toLowerCase();
  const keywords = [];
  
  const emotionalPatterns = [
    'scared', 'fear', 'afraid', 'terrified', 'frightened',
    'threat', 'danger', 'unsafe', 'worried', 'anxious',
    'hurt', 'pain', 'injured', 'violence', 'abuse',
    'cried', 'wept', 'sad', 'depressed', 'hopeless',
    'angry', 'rage', 'furious', 'upset',
    'followed', 'chased', 'attacked', 'grabbed'
  ];
  
  emotionalPatterns.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  return [...new Set(keywords)]; // Remove duplicates
}
