import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layout, 
  Newspaper, 
  Share2, 
  Loader2, 
  Sparkles, 
  Image as ImageIcon,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const MODEL_NAME = "gemini-2.5-flash-image";

interface GeneratedImage {
  id: string;
  type: "billboard" | "newspaper" | "social";
  url: string;
  title: string;
  description: string;
}

export default function App() {
  const [productDescription, setProductDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.GEMINI_API_KEY;

  const generateBrand = async () => {
    if (!productDescription.trim()) return;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      setError("API Key missing. Please create a .env file with your GEMINI_API_KEY to use the generator.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setImages([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const mediums = [
        {
          id: "billboard",
          title: "Billboard",
          prompt: `A massive highway billboard featuring: ${productDescription}. The product is the central focus, shot with professional commercial lighting. Clean, minimalist background. High-end advertising photography. ABSOLUTELY NO PEOPLE. No humans, no hands, no faces. Just the product in its environment.`,
          aspectRatio: "16:9" as const
        },
        {
          id: "newspaper",
          title: "Newspaper Ad",
          prompt: `A classic black and white newspaper advertisement for: ${productDescription}. Elegant serif typography, clean layout, high contrast. The product is clearly defined. Vintage yet modern print aesthetic. ABSOLUTELY NO PEOPLE. No humans, no hands, no faces. Just the product in its environment.`,
          aspectRatio: "3:4" as const
        },
        {
          id: "social",
          title: "Social Media Post",
          prompt: `A vibrant, trendy Instagram-style social media post for: ${productDescription}. Soft natural lighting, aesthetic tabletop styling, shallow depth of field. Modern, clean, and engaging. ABSOLUTELY NO PEOPLE. No humans, no hands, no faces. Just the product in its environment.`,
          aspectRatio: "1:1" as const
        }
      ];

      const generatedResults: GeneratedImage[] = [];

      // Generate images sequentially to avoid rate limits and ensure consistency
      for (const medium of mediums) {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: {
            parts: [{ text: medium.prompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: medium.aspectRatio
            }
          }
        });

        let imageUrl = "";
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }

        if (imageUrl) {
          generatedResults.push({
            id: medium.id,
            type: medium.id as any,
            url: imageUrl,
            title: medium.title,
            description: medium.prompt
          });
        }
      }

      setImages(generatedResults);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "An error occurred while generating the brand images.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Brand Builder</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Input Section */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                Product Vision
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Describe your product in detail. Mention materials, colors, and the overall "vibe" you want to convey.
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="e.g., A minimalist ceramic coffee dripper in matte charcoal grey, sitting on a light oak wooden stand..."
                  className="w-full h-40 p-4 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-200 placeholder:text-slate-600"
                />
                
                <button
                  onClick={generateBrand}
                  disabled={isGenerating || !productDescription.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Imagining...
                    </>
                  ) : (
                    <>
                      Build Brand
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </motion.div>
              )}
            </section>

            <section className="bg-indigo-950/20 p-6 rounded-2xl border border-indigo-900/30">
              <h3 className="text-indigo-300 font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Pro Tip
              </h3>
              <p className="text-sm text-indigo-200/70 leading-relaxed">
                Be specific about the lighting and environment. Instead of "a bottle," try "a glass bottle with condensation in soft morning sunlight."
              </p>
            </section>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
                    <Sparkles className="w-6 h-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Crafting your brand...</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">
                      Our AI is generating consistent product shots across different mediums. This takes a few moments.
                    </p>
                  </div>
                </motion.div>
              ) : images.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Brand Visuals</h2>
                    <button 
                      onClick={() => setImages([])}
                      className="text-sm text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Start Over
                    </button>
                  </div>

                  <div className="grid gap-12">
                    {/* Billboard */}
                    {images.find(img => img.type === "billboard") && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-500 font-medium uppercase tracking-wider text-xs">
                          <Layout className="w-4 h-4" />
                          Highway Billboard
                        </div>
                        <div className="relative group overflow-hidden rounded-3xl shadow-2xl border border-slate-800 aspect-[16/9] bg-slate-900">
                          <img 
                            src={images.find(img => img.type === "billboard")?.url} 
                            alt="Billboard"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                            <p className="text-white text-sm font-medium">16:9 Landscape Format</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-12">
                      {/* Newspaper */}
                      {images.find(img => img.type === "newspaper") && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-slate-500 font-medium uppercase tracking-wider text-xs">
                            <Newspaper className="w-4 h-4" />
                            Newspaper Ad
                          </div>
                          <div className="relative group overflow-hidden rounded-3xl shadow-xl border border-slate-800 aspect-[3/4] bg-slate-900">
                            <img 
                              src={images.find(img => img.type === "newspaper")?.url} 
                              alt="Newspaper"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                              <p className="text-white text-sm font-medium">3:4 Portrait Format</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Social */}
                      {images.find(img => img.type === "social") && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-slate-500 font-medium uppercase tracking-wider text-xs">
                            <Share2 className="w-4 h-4" />
                            Social Media Post
                          </div>
                          <div className="relative group overflow-hidden rounded-3xl shadow-xl border border-slate-800 aspect-square bg-slate-900">
                            <img 
                              src={images.find(img => img.type === "social")?.url} 
                              alt="Social Post"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                              <p className="text-white text-sm font-medium">1:1 Square Format</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 p-12 text-center"
                >
                  <div className="bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-800 mb-6">
                    <ImageIcon className="w-12 h-12 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to visualize?</h3>
                  <p className="text-slate-400 max-w-sm">
                    Enter your product description on the left to see it come to life across different advertising mediums.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          No humans were generated in this process
        </div>
      </footer>
    </div>
  );
}
