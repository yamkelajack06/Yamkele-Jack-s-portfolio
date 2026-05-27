// Sends message to API and returns response
export async function sendMessageToAI(message) {
  try {
    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    return "Sorry, I am currently unable to connect to the assistant.";
  }
}