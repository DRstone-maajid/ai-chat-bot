const chatEl = document.getElementById("chat");
const formEl = document.getElementById("chat-form");
const inputEl = document.getElementById("message-input");
const sendBtn = formEl.querySelector("button");

function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

addMessage("Hello, I am k.vm.s s. How can I help you?", "bot");

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = inputEl.value.trim();
  if (!message) return;

  addMessage(message, "user");
  inputEl.value = "";
  sendBtn.disabled = true;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });
    const text = await response.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    if (!response.ok) {
      addMessage(
        data?.error || `Request failed (${response.status}). Please try again.`,
        "bot"
      );
    } else {
      addMessage(data.reply, "bot");
    }
  } catch (error) {
    addMessage(`Network error: ${error.message}`, "bot");
  } finally {
    sendBtn.disabled = false;
    inputEl.focus();
  }
});
