import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(request: NextRequest) {
    try {
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured. Please add GEMINI_API_KEY to .env.local' },
                { status: 500 }
            );
        }

        const { message, documentContext, conversationHistory, fileUrl } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        // Build the content parts for the request
        let contentParts: any[] = [];

        // If we have a PDF file URL, fetch and include it
        if (fileUrl && documentContext?.type === 'document') {
            try {
                console.log('Fetching PDF from:', fileUrl);

                // Fetch the PDF file
                const fileResponse = await fetch(fileUrl);
                if (!fileResponse.ok) {
                    throw new Error(`Failed to fetch PDF: ${fileResponse.statusText}`);
                }

                // Convert to base64
                const arrayBuffer = await fileResponse.arrayBuffer();
                const base64Data = Buffer.from(arrayBuffer).toString('base64');

                console.log('PDF fetched and encoded, size:', base64Data.length);

                // Add the PDF as inline data
                contentParts.push({
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: base64Data
                    }
                });

                // Add the user's question
                contentParts.push({
                    text: `You are analyzing a PDF document titled "${documentContext.title}". ${documentContext.description ? `Description: ${documentContext.description}. ` : ''}Please answer the following question based on the document content:\n\n${message}`
                });

            } catch (fileError: any) {
                console.error('Error processing PDF:', fileError);
                return NextResponse.json(
                    {
                        error: 'Failed to process PDF file',
                        details: fileError.message
                    },
                    { status: 500 }
                );
            }
        } else {
            // No file, just use text prompt
            let prompt = '';

            if (documentContext) {
                prompt = `You are a helpful AI assistant analyzing a document. Here's the document context:

Document Title: ${documentContext.title}
Document Type: ${documentContext.type}
${documentContext.description ? `Description: ${documentContext.description}` : ''}

User Question: ${message}

Please provide a helpful and accurate answer based on the document context. If the question cannot be answered from the context, politely let the user know.`;
            } else {
                prompt = `You are a helpful AI study assistant. Help the user with their question:

${message}`;
            }

            contentParts.push({ text: prompt });
        }

        // Include conversation history for context
        if (conversationHistory && conversationHistory.length > 0) {
            const history = conversationHistory.map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            const chat = model.startChat({ history });
            const result = await chat.sendMessage(contentParts);
            const response = await result.response;
            const text = response.text();

            return NextResponse.json({ response: text });
        } else {
            const result = await model.generateContent(contentParts);
            const response = await result.response;
            const text = response.text();

            return NextResponse.json({ response: text });
        }
    } catch (error: any) {
        // Log detailed error server-side only
        console.error('Gemini API Error:', error.message);

        // Return sanitized error to client
        return NextResponse.json(
            {
                error: 'Failed to get AI response. Please try again later.'
            },
            { status: 500 }
        );
    }
}
