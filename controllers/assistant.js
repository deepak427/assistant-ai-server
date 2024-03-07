import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.OPENAI_API_KEY;
const assistantId = process.env.ASSISTANT_ID;

const openai = new OpenAI({
  apiKey: secretKey,
});

export const dunity = async (req, res) => {
  const { userText, threadId } = req.body;
  var communicationId = "";
  try {
    if (threadId == null) {
      const thread = await openai.beta.threads.create();
      communicationId = thread.id;
    } else {
      communicationId = threadId;
    }

    await openai.beta.threads.messages.create(communicationId, {
      role: "user",
      content: userText,
    });

    const run = await openai.beta.threads.runs.create(communicationId, {
      assistant_id: assistantId,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(
        communicationId,
        run.id
    );

    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(
        communicationId,
        run.id
      );
    }

    const messages = await openai.beta.threads.messages.list(communicationId);

    const lastMessageForRun = messages.data
      .filter(
        (message) => message.run_id === run.id && message.role === "assistant"
      )
      .pop();

    if (lastMessageForRun) {
      res.status(200).json({
        response: lastMessageForRun.content[0].text.value,
        threadId: communicationId,
      });
    } else {
      res.status(200).json({ response: null, threadId: communicationId });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
