import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ToolCard from './components/ToolCard';
import BackgroundRemover from './components/tools/BackgroundRemover';
import ColorPalette from './components/tools/ColorPalette';
import { FaMagic, FaPalette, FaCrop } from 'react-icons/fa';

function App() {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    {
      id: 'bg-remover',
      name: 'Background Remover',
      description: 'Remove backgrounds from images instantly with AI',
      icon: FaMagic,
      component: BackgroundRemover,
      isPro: true
    },
    {
      id: 'color-palette',
      name: 'Color Palette Generator',
      description: 'Extract beautiful color palettes from images',
      icon: FaPalette,
      component: ColorPalette,
      isPro: false
    },
    {
      id: 'image-resizer',
      name: 'Image Resizer',
      description: 'Resize images for various social media platforms',
      icon: FaCrop,
      component: null, // Coming soon
      isPro: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {!activeTool ? (
          <div>
            <h1 className="text-4xl font-bold text-center mb-12">
              Creator's Swiss Army Knife
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  {...tool}
                  onClick={() => tool.component && setActiveTool(tool)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveTool(null)}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Tools
            </button>
            <activeTool.component />
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2023 Creator's Swiss Army Knife. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
