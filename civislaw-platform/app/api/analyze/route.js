import { NextResponse } from 'next/server';

// Simulated AI processing - in production, this would call OpenAI/Claude API
export async function POST(request) {
  try {
    const body = await request.json();
    const { document, language } = body;

    if (!document || document.trim().length === 0) {
      return NextResponse.json(
        { error: 'Document text is required' },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response - in production, use actual AI API
    const mockResponse = {
      success: true,
      data: {
        plainLanguage: generatePlainLanguage(document),
        meaning: "This is a legal document that requires court action.",
        processImpact: "The court expects a response within the specified time period.",
        keyTerms: extractKeyTerms(document),
        language: language || 'en'
      }
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Document analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}

function generatePlainLanguage(text) {
  // Mock function - would use actual AI in production
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('dismissed') || lowerText.includes('dismissal')) {
    return "The court has rejected the application or petition. This means your request was not accepted by the judge.";
  }
  if (lowerText.includes('summon') || lowerText.includes('summons')) {
    return "You are being called to appear in court on a specific date. You must be present on that date.";
  }
  if (lowerText.includes('adjourn') || lowerText.includes('adjournment')) {
    return "The court proceeding has been postponed to another date. The case will continue on the new date.";
  }
  if (lowerText.includes('objection')) {
    return "A party in the case is saying something is not allowed or is incorrect.";
  }
  if (lowerText.includes('fir') || lowerText.includes('first information')) {
    return "A First Information Report has been registered. This is the first official record of the reported incident.";
  }
  
  return "This document contains legal language that has been simplified for your understanding.";
}

function extractKeyTerms(text) {
  const terms = [];
  const lowerText = text.toLowerCase();
  
  const keyTermPatterns = [
    { term: 'Petition', meaning: 'A formal request to the court' },
    { term: 'Dismissed', meaning: 'Rejected or turned down' },
    { term: 'Summons', meaning: 'Order to appear in court' },
    { term: 'Adjournment', meaning: 'Postponement to another day' },
    { term: 'Objection', meaning: 'Formal disagreement with something' },
    { term: 'Plaintiff', meaning: 'Person who starts the case' },
    { term: 'Defendant', meaning: 'Person the case is against' },
    { term: 'Respondent', meaning: 'Person who responds to a case' },
    { term: 'Accused', meaning: 'Person charged with a crime' },
    { term: 'FIR', meaning: 'First Information Report' },
    { term: 'Bail', meaning: 'Temporary release from custody' },
    { term: 'Cognizable', meaning: 'Police can arrest without warrant' },
    { term: 'Non-Cognizable', meaning: 'Police need warrant to arrest' },
    { term: 'Charge Sheet', meaning: 'Document with charges against accused' },
    { term: 'Judgment', meaning: 'Final court decision' }
  ];

  keyTermPatterns.forEach(({ term, meaning }) => {
    if (lowerText.includes(term.toLowerCase())) {
      terms.push({ term, meaning });
    }
  });

  // Return unique terms
  return [...new Map(terms.map(item => [item.term, item])).values()];
}
