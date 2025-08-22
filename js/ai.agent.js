document.getElementById('ai-agent-btn').onclick = function () {
  document.getElementById('ai-agent-modal').style.display = 'block';
  setTimeout(() => {
    document.getElementById('ai-chat-input').focus();
  }, 100);
};

document.getElementById('ai-agent-close').onclick = function () {
  document.getElementById('ai-agent-modal').style.display = 'none';
};

document.getElementById('ai-chat-send').onclick = sendAIMessage;
document.getElementById('ai-chat-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') sendAIMessage();
});

async function sendAIMessage() {
  const input = document.getElementById('ai-chat-input').value.trim();
  if (!input) return;

  appendMessage('user', input);
  document.getElementById('ai-chat-input').value = '';
  appendMessage('ai', 'Thinking...');

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: input }] }]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini API response:", data);

    const aiReply =
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0].text
        ? data.candidates[0].content.parts[0].text
        : `Sorry, I could not generate a response. Raw response: ${JSON.stringify(data)}`;

    updateLastAIMessage(aiReply);
  } catch (err) {
    updateLastAIMessage("Error connecting to Gemini API.");
    console.error("AI agent error:", err);
  }
}

function appendMessage(role, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = role === "user" ? "ai-chat-user" : "ai-chat-ai";
  msgDiv.textContent = text;
  document.getElementById("ai-chat-messages").appendChild(msgDiv);
  document.getElementById("ai-chat-messages").scrollTop =
    document.getElementById("ai-chat-messages").scrollHeight;
}

function updateLastAIMessage(text) {
  const msgs = document.querySelectorAll("#ai-chat-messages .ai-chat-ai");
  if (msgs.length) msgs[msgs.length - 1].textContent = text;
  document.getElementById("ai-chat-messages").scrollTop =
    document.getElementById("ai-chat-messages").scrollHeight;
}
