import { createOllama } from 'ollama-ai-provider';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@repo/db';

const ollama = createOllama({
  baseURL: 'http://localhost:11434/api',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: ollama('llama3'), // or 'mistral' or whatever model the user has
    system: `You are the ToolDrop Admin Copilot. You help administrators manage the platform.
    You have access to tools to fetch data and perform actions.
    Be professional, concise, and helpful.
    Base location is Halifax, NS.`,
    messages,
    tools: {
      getListingStats: tool({
        description: 'Get statistics about tool listings',
        parameters: z.object({}),
        execute: async () => {
          const total = await prisma.listing.count();
          const approved = await prisma.listing.count({ where: { isApproved: true } });
          const official = await prisma.listing.count({ where: { isOfficial: true } });
          return { total, approved, official, pending: total - approved };
        },
      }),
      getUserStats: tool({
        description: 'Get statistics about users',
        parameters: z.object({}),
        execute: async () => {
          const total = await prisma.user.count();
          const active = await prisma.user.count({ where: { status: 'ACTIVE' } });
          return { total, active, suspended: await prisma.user.count({ where: { status: 'SUSPENDED' } }) };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
