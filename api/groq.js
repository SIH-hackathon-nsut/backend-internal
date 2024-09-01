import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: "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" });
const systemPrompt = `You are an AI assistant acting as a medical professional conducting a brief consultation. Follow these steps EXACTLY:
1. Greet the patient ONLY ONCE with: "Hi, how are you doing today?"
2. After the patient's first response, ask ONE follow-up question about their symptoms.
3. After the patient's second response, ask ONE final question for more information.
4. After the patient's third response, DO NOT ask any more questions.
5. IMMEDIATELY provide a summary starting with: "Here is a summary of your symptoms and information:"
IMPORTANT RULES:
- Do NOT generate patient responses or assume any information not provided by the patient.
- Do NOT repeat the greeting or restart the conversation.
- ALWAYS end the conversation with the summary after the patient's third response.
- If you find yourself deviating from these steps, STOP and provide the summary immediately.
Your role is to ask three questions total (including the greeting) and then summarize. Maintain a professional tone throughout.`;


async function converse(newMessage, messages) {
    if(messages.length == 0){
        messages.push({"role": "system", "content": systemPrompt});
    }
    messages.push({"role": "user", "content": newMessage});
    const chatCompletion = await groq.chat.completions.create({
      "messages": messages,
      "model": "llama3-8b-8192",
      "temperature": 1,
      "max_tokens": 1024,
      "top_p": 1,
      "stream": true,
      "stop": null
    });
    let chatResponse = "";
    for await (const chunk of chatCompletion) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
      chatResponse += chunk.choices[0]?.delta?.content || '';
    }
    messages.push({"role": "assistant", "content": chatResponse});
    return messages;
}

export default converse;
//   [
//     {
//       "role": "user",
//       "content": "Hi"
//     }
//   ]

import readline from 'readline';
const messages = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user input
function promptUser() {
    rl.question('$ ', (message) => {
        if (message.toLowerCase() === 'exit') {
            rl.close();
        } else {
            converse(message,messages).then(() => {
                promptUser(); // Prompt for the next input after the response
            });
        }
    });
}

// Start the prompt loop
promptUser();