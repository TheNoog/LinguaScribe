# LinguaScribe - AI Story Generator

This is a Next.js application called LinguaScribe that allows you to generate short stories in different languages, along with accompanying images, using AI.

## Getting Started

To run the application locally, follow these steps:

1.  **Stop the npm server (if already running):**
    If you have the development server running, stop it by pressing `Ctrl + C` in the terminal where it's running.

2.  **Install dependencies:**
    If you haven't already, install the project dependencies using npm:
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the Next.js development server, typically on `http://localhost:9002`.

## How to Use LinguaScribe

Once the development server is running:

1.  Open your web browser and navigate to `http://localhost:9002`.
2.  You'll see the LinguaScribe interface.
3.  Use the form to:
    *   Select a **Language** for your story.
    *   Choose the **Language Level** (e.g., A1, B2).
    *   Pick a **Story Topic** from the presets or enter a custom topic.
4.  Click the "Generate Story" button.
5.  The AI will generate a short story in the selected language, an English translation, and an illustrative image.
6.  You can use the audio player to listen to the story in the generated language.

Enjoy creating and exploring stories!

## Troubleshooting

If you suspect a server might be running and interfering, you can use the following command to see a list of running processes and the ports they are using:

lsof -i -P -n
