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
  const session = await auth();
  const userName = session?.user?.name || 'Guest';

  const result = await streamText({
    model: ollama('ministral-3:8b'),
    maxSteps: 3,
    system: `You are the ToolDrop Scout, a helpful AI assistant for a tool rental marketplace in Halifax, Nova Scotia.
    Your goal is to help users find tools, explain how the platform works, and provide advice on DIY projects.
    Be friendly, helpful, and "handy". Use tool-related puns occasionally.
    If asked about specific tools, use your search tools to find them.
    
    You are currently talking to ${userName}. Address them by name if appropriate.`,
    messages,
    tools: {
      searchTools: tool({
        description: 'Search for available tools in the marketplace',
        inputSchema: z.object({
          query: z.string().describe('The name or type of tool to search for'),
        }),
        execute: async ({ query }) => {
          const tools = await prisma.listing.findMany({
            where: {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
              isApproved: true,
              isAvailable: true,
            },
            take: 3,
            select: {
              title: true,
              pricePerDay: true,
              pricePerHour: true,
              slug: true,
            }
          });
          return tools;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
