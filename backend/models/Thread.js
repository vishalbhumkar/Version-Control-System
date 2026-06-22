const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const copilotDbUri = process.env.COPILOT_MONGO_URI;
if (!copilotDbUri) {
  console.error("Warning: COPILOT_MONGO_URI is not defined in environment variables!");
}

// Create a separate connection specifically for the Copilot database
const copilotConnection = mongoose.createConnection(copilotDbUri);

copilotConnection.on("connected", () => {
  console.log("Mongoose connected to Copilot database successfully.");
});

copilotConnection.on("error", (err) => {
  console.error("Mongoose Copilot database connection error:", err);
});

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ThreadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: "New Chat"
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Bind the schema to the separate connection instead of the default mongoose instance
const Thread = copilotConnection.model("Thread", ThreadSchema);

module.exports = Thread;
