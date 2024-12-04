import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaUpload, FaSpinner, FaCopy } from 'react-icons/fa';

const ColorPalette = () => {
  const [image, setImage] = useState(null);
  const [palette, setPalette] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      await extractColors(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const extractColors = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/generate-palette', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setPalette(response.data.palette);
      toast.success('Color palette generated!');
    } catch (error) {
      toast.error('Error generating palette. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard!`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Color Palette Generator</h2>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {!image && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <input {...getInputProps()} />
            <FaUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports PNG, JPG up to 10MB
            </p>
          </div>
        )}

        {image && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Source Image</h3>
              <img
                src={image}
                alt="Source"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Color Palette</h3>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : palette.length > 0 ? (
                <div className="grid grid-cols-5 gap-4">
                  {palette.map((color, index) => (
                    <div
                      key={index}
                      className="relative group"
                      onClick={() => copyColor(color)}
                    >
                      <div
                        className="h-32 rounded-lg shadow-sm cursor-pointer transition-transform transform hover:scale-105"
                        style={{ backgroundColor: color }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white px-3 py-1 rounded-full shadow-lg flex items-center">
                          <FaCopy className="mr-1" />
                          {color}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPalette;
