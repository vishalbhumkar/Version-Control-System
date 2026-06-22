const express = require("express");
const Thread = require("../models/Thread");
const getOpenAIAPIResponse = require("../utils/openai");

const copilotRouter = express.Router();

// Get all threads
copilotRouter.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    // Keep it minimal: only return threadId and title
    const filteredThreads = threads.map((t) => ({
      threadId: t.threadId,
      title: t.title,
    }));
    res.json(filteredThreads);
  } catch (err) {
    console.error("Error fetching threads:", err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// Get messages in a single thread
copilotRouter.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.error("Error fetching thread messages:", err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Delete a thread
copilotRouter.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.error("Error deleting thread:", err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// Chat endpoint (sends prompt to Gemini and stores conversation)
copilotRouter.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      // Create new thread
      const title = message.slice(0, 30) + (message.length > 30 ? "..." : "");
      thread = new Thread({
        threadId,
        title,
        messages: [{ role: "user", content: message }]
      });
    } else {
      // Append user message to existing thread
      thread.messages.push({ role: "user", content: message });
    }

    // Call Gemini API helper
    const assistantReply = await getOpenAIAPIResponse(message);

    // Append assistant reply
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.error("Error in copilot chat:", err);
    res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = copilotRouter;
