# AI Code Reviewer

Paste your code, get an instant, beginner-friendly review powered by Google Gemini.

🔗 **Live demo:** [Code-reviewer](https://code-reviewer-nine-nu.vercel.app/)

## Features

- Code editor with syntax highlighting
- AI-generated review rendered as clean markdown
- Concise feedback on bugs, readability, and best practices

## Tech Stack

- **Frontend:** React (Vite), react-simple-code-editor, react-markdown, Axios
- **Backend:** Node.js, Express
- **AI:** Google Gemini API

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Arpit11-svg/code-reviewer.git
cd your-repo

# Backend
cd backend
npm install
echo "GOOGLE_GEMINI_KEY=your_api_key" > .env
npm start        # runs on http://localhost:3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## API

`POST /ai/get-review` – body: `{ "code": "<your code>" }` → returns the review as markdown.

## License

MIT