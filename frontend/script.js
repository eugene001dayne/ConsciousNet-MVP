const form = document.getElementById("chat-form");
const input = document.getElementById("question");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = input.value.trim();
  if (!question) return;

  // Show user question in chat
  chatBox.innerHTML += `<div class="user-msg">🧑: ${question}</div>`;
  input.value = "";

  try {
    const response = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    if (data.answer) {
      chatBox.innerHTML += `<div class="ai-msg">🤖: ${data.answer}</div>`;
    } else {
      chatBox.innerHTML += `<div class="ai-msg error">⚠️ Error: ${data.error}</div>`;
    }
  } catch (err) {
    chatBox.innerHTML += `<div class="ai-msg error">❌ Server not responding</div>`;
  }

  // Scroll to latest message
  chatBox.scrollTop = chatBox.scrollHeight;
});