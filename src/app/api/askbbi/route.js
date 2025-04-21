export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { saveAskBbiLog } from '../../../utils/contentfulAskBbi';

// Helper: query OpenAI GPT
async function askOpenAI(question) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY');
    return null;
  }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        max_tokens: 512
      })
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('OpenAI API error:', res.status, err);
      return null;
    }
    const data = await res.json();
    return {
      answer: data.choices?.[0]?.message?.content?.trim() || null,
      model: 'openai-gpt-3.5-turbo'
    };
  } catch (e) {
    console.error('OpenAI fetch failed:', e);
    return null;
  }
}

// Helper: query Anthropic Claude (v2)
async function askClaude(question) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Missing ANTHROPIC_API_KEY');
    return null;
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-2.1',
        max_tokens: 512,
        messages: [{ role: 'user', content: question }]
      })
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Anthropic API error:', res.status, err);
      return null;
    }
    const data = await res.json();
    return {
      answer: data.content?.[0]?.text?.trim() || null,
      model: 'anthropic-claude-2.1'
    };
  } catch (e) {
    console.error('Anthropic fetch failed:', e);
    return null;
  }
}

// Helper: query HuggingFace Inference API (free LLMs)
async function askHuggingFace(question) {
  const apiUrl = 'https://api-inference.huggingface.co/models/google/flan-t5-small'; // a small, instruction-tuned QA model
  const hfKey = process.env.HUGGINGFACE_API_KEY;
  const headers = hfKey
    ? { 'Authorization': `Bearer ${hfKey}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ inputs: question })
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('HuggingFace API error:', res.status, err);
      return null;
    }
    const data = await res.json();
    let answer = null;
    // Flan-T5 returns an array with 'generated_text' or an object with 'generated_text'
    if (Array.isArray(data) && data[0]?.generated_text) answer = data[0].generated_text.trim();
    if (typeof data.generated_text === 'string') answer = data.generated_text.trim();
    // For Flan-T5, sometimes 'data' is just a string
    if (typeof data === 'string') answer = data.trim();
    return {
      answer: answer,
      model: 'hf-google-flan-t5-small'
    };
  } catch (e) {
    console.error('HuggingFace fetch failed:', e);
    return null;
  }
}

// Helper: randomly select an LLM
async function askAnyLLM(question) {
  const llms = [askOpenAI, askClaude, askHuggingFace];
  for (let fn of llms.sort(() => Math.random() - 0.5)) {
    try {
      const result = await fn(question);
      if (result && result.answer) return result;
    } catch (e) {
      console.error('LLM call failed:', e);
    }
  }
  return { answer: 'Sorry, I could not get an answer right now.', model: 'none' };
}

export async function POST(req) {
  const { question } = await req.json();
  if (!question || typeof question !== 'string') {
    return NextResponse.json({ answer: 'Please provide a valid question.' }, { status: 400 });
  }
  const { answer, model } = await askAnyLLM(question);

  // Log to Contentful
  await saveAskBbiLog({ question, answer, model });

  return NextResponse.json({ answer });
}
