# MediSpeak

A real-time medical translation platform designed to bridge language barriers between healthcare providers and patients. MediSpeak enables secure, accurate, and efficient communication in multilingual healthcare settings.

## Overview

MediSpeak is a Next.js-based web application that provides real-time bidirectional translation capabilities for medical consultations. The platform prioritizes patient privacy through data anonymization and offers an intuitive interface designed specifically for healthcare environments.

## Core Features

### 🔐 Secure Authentication
- Secure login and logout functionality for authorized healthcare personnel
- Password recovery system
- Session management with automatic routing

### 🗣️ Real-Time Translation
- Bidirectional translation between multiple languages and English
- Auto-detection of patient's spoken language
- High-accuracy AI-powered translations using Google's Genkit AI
- Translation confidence scoring

### 🔒 Data Privacy & Anonymization
- Automatic anonymization of patient data (names, dates of birth)
- HIPAA-compliant data handling
- Secure processing before AI translation

### 🎙️ Voice Integration
- Speech-to-text functionality for both doctors and patients
- Text-to-speech output for translated conversations
- Support for multiple language voice synthesis

### 📝 Conversation Management
- Real-time conversation transcript display
- Editable transcript entries with re-processing capability
- Conversation timer for consultation duration tracking
- Session management and consultation end functionality

### 🌐 Multi-Language Support
Currently supports:
- English
- Bangla (Bengali)
- Urdu
- Somali
- Arabic
- Polish

### 📊 Healthcare-Optimized UI
- Clean, professional interface designed for medical environments
- Calm blue color scheme (#5DADE2) for healthcare settings
- Intuitive layout optimized for quick access during consultations
- Responsive design for various devices

## Technical Architecture

### Frontend Stack
- **Next.js 15.3.3** - React framework with app directory structure
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management with Zod validation
- **Radix UI** - Accessible component library

### AI & Translation
- **Google Genkit AI** - AI workflow orchestration
- **Custom AI Flows**:
  - Real-time translation
  - Auto language detection
  - Data anonymization

### Key Libraries
- **Lucide React** - Icon library
- **Firebase** - Authentication and backend services
- **Date-fns** - Date manipulation
- **Recharts** - Data visualization
- **Web Speech API** - Speech recognition and synthesis

## Project Structure

```
src/
├── ai/                          # AI-powered features
│   ├── flows/
│   │   ├── real-time-translation.ts    # Translation logic
│   │   ├── auto-detect-language.ts     # Language detection
│   │   └── anonymize-data.ts          # Data anonymization
│   ├── genkit.ts                      # AI configuration
│   └── dev.ts                         # Development setup
├── app/                         # Next.js app directory
│   ├── dashboard/               # Main application interface
│   ├── forgot-password/         # Password recovery
│   ├── privacy-policy/          # Legal pages
│   └── terms-of-service/
├── components/                  # React components
│   ├── conversation/            # Translation interface
│   ├── layout/                  # App layout components
│   ├── shared/                  # Shared components
│   └── ui/                      # UI component library
├── contexts/                    # React contexts
│   └── AuthContext.tsx          # Authentication state
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
│   ├── tts.ts                   # Text-to-speech
│   └── utils.ts                 # General utilities
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with microphone access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MediSpeak
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Configure your environment variables
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:9002`

### AI Development

For AI feature development with Genkit:

```bash
# Start Genkit development server
npm run genkit:dev

# Watch mode for AI development
npm run genkit:watch
```

## Available Scripts

- `npm run dev` - Start development server (port 9002)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit in watch mode

## Usage

### For Healthcare Providers

1. **Login**: Access the secure login portal
2. **Language Selection**: Choose the patient's primary language
3. **Translation**: 
   - Type or speak your message in English
   - The system automatically translates to the patient's language
   - Audio playback is provided for translated text
4. **Patient Response**: 
   - Enter patient responses manually or use speech-to-text
   - Automatic translation back to English
5. **Session Management**: Track consultation time and manage transcripts

### Privacy Controls

- **Data Anonymization**: Toggle on/off based on consultation requirements
- **Transcript Editing**: Edit messages in real-time with re-processing capability
- **Session Clearing**: Secure end-of-consultation cleanup

## Security & Privacy

- All patient data is anonymized before AI processing
- No persistent storage of sensitive patient information
- Secure session management
- HIPAA-compliant data handling practices
- Local browser storage for session data only

## Browser Compatibility

- Chrome (recommended for full speech recognition support)
- Firefox
- Safari
- Edge

**Note**: Speech recognition features work best in Chrome due to Web Speech API support.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run typecheck && npm run lint`
5. Submit a pull request

## License

This project is proprietary software designed for healthcare use. Please contact the development team for licensing information.

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**MediSpeak** - Bridging language barriers in healthcare, one conversation at a time.