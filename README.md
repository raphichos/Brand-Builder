# Brand Builder

A sophisticated AI-powered tool for visualizing products across multiple advertising mediums. Describe your product, and Brand Builder generates consistent, professional-grade visuals for billboards, newspapers, and social media posts.

## | Features

- **Multi-Medium Visualization**: Generate consistent product shots for three distinct formats:
  - **Highway Billboard** (16:9 Landscape)
  - **Newspaper Advertisement** (3:4 Portrait)
  - **Social Media Post** (1:1 Square)
- **Visual Consistency**: Maintains product identity across different environments and lighting conditions.
- **Human-Free Generation**: Specifically engineered to focus on product photography, excluding people and hands for a clean commercial look.
- **Sophisticated Dark UI**: A premium, dark-themed interface built for a professional creative workflow.
- **Powered by Gemini**: Utilizes the latest Nano-Banana image generation models.

## | Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **AI**: Google Gemini API (`gemini-2.5-flash-image`)

## | Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/brand-builder.git
   cd brand-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to `http://localhost:5173` in your browser.

## | Usage

1. Enter a detailed description of your product (e.g., *"A minimalist matte black electric kettle with a gooseneck spout and a walnut handle"*).
2. Click **Build Brand**.
3. Wait for the AI to craft your visuals across the three mediums.
4. Use the "Start Over" button to visualize a new product concept.

## | License

This project is licensed under the Apache-2.0 License.