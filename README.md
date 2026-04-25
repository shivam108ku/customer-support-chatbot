# Customer Support Chatbot

An intelligent customer support assistant built with **LangChain** and **LangGraph**, designed as a **stateful, tool-augmented conversational agent** for real-world support workflows.

It uses **DeepSeek LLM** for context-aware response generation and integrates **Langfuse** observability for tracing, debugging, and evaluating model interactions in real time.

## Key Features

- Stateful conversations with memory persistence
- Tool calling for enriched, action-capable responses
- Context-aware answer generation using DeepSeek
- Real-time conversation tracking and observability with Langfuse
- Debuggable and evaluable LLM workflow architecture

## Tech Stack

- **Javascript**
- **LangChain**
- **LangGraph**
- **DeepSeek LLM**
- **Langfuse**

## Architecture Overview

The chatbot follows a graph-based conversational flow:

1. User input is received and added to conversation state
2. LangGraph routes the request through the appropriate nodes
3. DeepSeek LLM generates responses with available context
4. Tools are invoked when external actions/data are required
5. Memory is updated for multi-turn continuity
6. Langfuse logs traces for observability and evaluation

## Getting Started

### 1) Clone the repository

```bash
git clone https://github.com/shivam108ku/customer-support-chatbot.git
cd customer-support-chatbot
```

### 2) Create and activate a virtual environment

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
```

### 3) Install dependencies

```bash
pip install -r requirements.txt
```

### 4) Configure environment variables

Create a `.env` file in the project root:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com
```

### 5) Run the chatbot

```bash
python main.py
```

> Update the entrypoint command above if your main file is different.

## Observability with Langfuse

Langfuse integration helps you:

- Trace each model/tool call end-to-end
- Debug latency, token usage, and response quality
- Evaluate runs and improve prompt/workflow reliability

## Project Goals

- Deliver fast, consistent customer support interactions
- Improve transparency in LLM behavior via traceability
- Enable easy experimentation with tools and state graphs

## Roadmap

- Add domain-specific support knowledge base (RAG)
- Introduce guardrails and fallback handling
- Add human-in-the-loop escalation for sensitive requests
- Extend evaluation suite for regression tracking

## Contributing

Contributions are welcome. Open an issue to discuss ideas, bugs, or feature requests before submitting a PR.

## License

This project is licensed under the MIT License (or your preferred license).
