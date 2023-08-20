# Live Stream Chat Analyzer

## Getting Started

Install the python dependencies.
```bash
pip install -r requirements.txt
```

Install Next.js client. 
```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Set up the environment variables on the root directory to store the secret keys.

```
# .env

# OpenAI
OPENAI_API_KEY = {API_KEY_FROM_OPENAI}

# Twitch
TWITCH_CLIENT_ID = {CLIENT_ID_KEY_FROM_TWITCH}
TWITCH_CLIENT_SECRET = {CLIENT_SECRET_KEY_FROM_TWITCH}
TWITCH_CHANNEL_NAME = {sodapoppin}
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
