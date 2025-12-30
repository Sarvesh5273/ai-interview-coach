# SkillNova Voice: AI Technical Interviewer

**Winner of the "ElevenLabs Challenge" Criteria**
SkillNova Voice is a real-time technical interview coach that combines **Google Gemini 2.5 Flash** (Brain) with **ElevenLabs Conversational AI** (Voice) to simulate a high-pressure interview environment.

## 🚀 The Stack
- **Voice AI:** ElevenLabs Conversational Agents (Websocket)
- **Intelligence:** Google Vertex AI / Gemini 2.5 Flash via Generative AI SDK
- **Frontend:** React + Vite + Tailwind CSS
- **Design:** Glassmorphism UI with framer-motion animations

## 🛠️ How to Run Locally

### 1. Clone the Repo
```bash
git clone [https://github.com/Sarvesh5273/ai-interview-coach.git](https://github.com/Sarvesh5273/ai-interview-coach.git)
cd ai-interview-coach

2. Install Dependencies
npm install

3. Set up Environment Keys
Create a .env file in the root directory:
VITE_GEMINI_API_KEY=your_google_ai_studio_key
VITE_ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id

4. Run the App
npm run dev


🤖 How it Works
Audio Input: The user speaks into the microphone.

ElevenLabs Processing: The audio is streamed to ElevenLabs, which converts speech to text.

Gemini Logic: The text is processed by a Gemini-powered agent to generate a context-aware response.

Voice Output: ElevenLabs generates a human-like voice response and streams it back.

Feedback Loop: Upon ending the session, the entire transcript is sent to Google Gemini to generate a "Hiring Decision" report card.

📄 License
This project is open source under the MIT License.