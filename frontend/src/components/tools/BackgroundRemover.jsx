import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaUpload, FaSpinner, FaDownload } from 'react-icons/fa';

const BackgroundRemover = () => {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      await processImage(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const processImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/remove-background', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setProcessedImage(response.data.url);
      toast.success('Background removed successfully!');
    } catch (error) {
      toast.error('Error processing image. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processed-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Error downloading image');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">AI Background Remover</h2>
      
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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Original Image</h3>
              <img
                src={image}
                alt="Original"
                className="w-full rounded-lg"
              />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Processed Image</h3>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : processedImage ? (
                <div>
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={downloadImage}
                    className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundRemover;
