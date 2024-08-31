import { HfInference } from "@huggingface/inference";
import readline from 'readline';

const inference = new HfInference("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");

const systemPrompt = `
Act as a doctor. Begin by saying: "Hi, how can I help you today?" After the patient describes their symptoms, request additional details if necessary. Once all symptoms and relevant information are gathered, respond with a summary in the format specified below. Conclude your interaction within three messages.

Final message format:
- Start with: "Here's a summary of your symptoms and information provided:"
- Summarize all symptoms and relevant information given by the patient.
- Do not provide any treatments, diagnoses, or advice.

Note: Ensure the interaction does not exceed three messages in total.
`;

// Initialize the messages array to store conversation history
const messages = [];

async function converse(newMessage, messages) {
    // Append the new message to the conversation history
    if(messages.length == 0){
        messages.push({"role": "system", "content": systemPrompt});

    }
    messages.push({ role: "user", content: newMessage });

    let responseContent = "";

    for await (const chunk of inference.chatCompletionStream({
        model: "mistralai/Mistral-Nemo-Instruct-2407",
        messages: messages,
        max_tokens: 500,
    })) {
        responseContent += chunk.choices[0]?.delta?.content || "";
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }

    // Append the response to the conversation history
    messages.push({ role: "assistant", content: responseContent });
    return messages;
}
export default converse;
// Create readline interface
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