import { NextResponse } from 'next/server';

// Simulated translation service - in production, use Google Translate API or similar
export async function POST(request) {
  try {
    const body = await request.json();
    const { text, sourceLang, targetLang } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text to translate is required' },
        { status: 400 }
      );
    }

    if (!sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'Source and target languages are required' },
        { status: 400 }
      );
    }

    // Simulate translation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock translation - in production, use actual translation API
    const mockTranslation = mockTranslate(text, sourceLang, targetLang);

    return NextResponse.json({
      success: true,
      data: {
        original: text,
        translation: mockTranslation,
        sourceLang,
        targetLang
      }
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    );
  }
}

function mockTranslate(text, sourceLang, targetLang) {
  // Mock translations for demonstration
  // In production, use actual translation API
  
  if (targetLang === 'hi') {
    return mockHindiTranslation(text);
  }
  if (targetLang === 'ta') {
    return mockTamilTranslation(text);
  }
  if (targetLang === 'te') {
    return mockTeluguTranslation(text);
  }
  
  // Default: return English if target is English or unknown
  return text;
}

function mockHindiTranslation(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('court') || lowerText.includes('the court')) {
    return 'न्यायालय';
  }
  if (lowerText.includes('hearing')) {
    return 'सुनवाई';
  }
  if (lowerText.includes('dismissed')) {
    return 'खारिज';
  }
  if (lowerText.includes('summons')) {
    return 'समन';
  }
  if (lowerText.includes('objection')) {
    return 'आपत्ति';
  }
  if (lowerText.includes('adjournment')) {
    return 'स्थगन';
  }
  if (lowerText.includes('witness')) {
    return 'गवाह';
  }
  if (lowerText.includes('evidence')) {
    return 'साक्ष्य';
  }
  if (lowerText.includes('verdict')) {
    return 'निर्णय';
  }
  
  return `[Hindi translation of: ${text}]`;
}

function mockTamilTranslation(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('court') || lowerText.includes('the court')) {
    return 'நீதிமன்றம்';
  }
  if (lowerText.includes('hearing')) {
    return 'விசாரணை';
  }
  if (lowerText.includes('dismissed')) {
    return 'தள்ளுபடி';
  }
  if (lowerText.includes('summons')) {
    return 'அழைப்பாணை';
  }
  if (lowerText.includes('objection')) {
    return 'எதிர்ப்பு';
  }
  if (lowerText.includes('adjournment')) {
    return 'ஒத்திவைப்பு';
  }
  if (lowerText.includes('witness')) {
    return 'சாட்சி';
  }
  if (lowerText.includes('evidence')) {
    return 'சான்று';
  }
  if (lowerText.includes('verdict')) {
    return 'தீர்ப்பு';
  }
  
  return `[Tamil translation of: ${text}]`;
}

function mockTeluguTranslation(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('court') || lowerText.includes('the court')) {
    return 'కోర్టు';
  }
  if (lowerText.includes('hearing')) {
    return 'విచారణ';
  }
  if (lowerText.includes('dismissed')) {
    return 'తిరస్కరణ';
  }
  if (lowerText.includes('summons')) {
    return 'సమనం';
  }
  if (lowerText.includes('objection')) {
    return 'ఆపత్తి';
  }
  if (lowerText.includes('adjournment')) {
    return 'వాయిదా';
  }
  if (lowerText.includes('witness')) {
    return 'సాక్షి';
  }
  if (lowerText.includes('evidence')) {
    return 'సాక్ష్యం';
  }
  if (lowerText.includes('verdict')) {
    return 'తీర్పు';
  }
  
  return `[Telugu translation of: ${text}]`;
}
