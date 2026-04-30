import { createOllama } from 'ai-sdk-ollama';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@repo/db';
import { auth } from '@/lib/auth';

const ollama = createOllama({
  baseURL: 'https://ollama.com',
  apiKey: process.env.OLLAMA_API_KEY,
});

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Transform messages to match CoreMessage[] schema (mapping 'parts' to 'content')
  const formattedMessages = messages.map((m: any) => ({
    role: m.role,
    content: m.content || (Array.isArray(m.parts) ? m.parts.map((p: any) => p.text || '').join('') : ''),
  }));

  const session = await auth();
  const userName = session?.user?.name || 'Administrator';

  const result = await streamText({
    model: ollama('gpt-oss:120b'),
    system: `You are the ToolDrop Admin Copilot. You help administrators manage the platform.
    You have access to tools to fetch data and perform actions.
    Be professional, concise, and helpful.
    Base location is Halifax, NS.
    
    You are currently assisting ${userName}.`,
    messages: formattedMessages,
    tools: {
      getListingStats: tool({
        description: 'Get statistics about tool listings',
        inputSchema: z.object({}),
        execute: async () => {
          const total = await prisma.listing.count();
          const approved = await prisma.listing.count({ where: { isApproved: true } });
          const official = await prisma.listing.count({ where: { isOfficial: true } });
          return { total, approved, official, pending: total - approved };
        },
      }),
      getUserStats: tool({
        description: 'Get statistics about users',
        inputSchema: z.object({}),
        execute: async () => {
          const total = await prisma.user.count();
          const active = await prisma.user.count({ where: { status: 'ACTIVE' } });
          return { total, active, suspended: await prisma.user.count({ where: { status: 'SUSPENDED' } }) };
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
