'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react'
import { uploadProductImage } from '../lib/supabase'

export default function UploadTestPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setUploadResult(null)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setUploadResult(null)

    try {
      const result = await uploadProductImage(selectedFile)
      setUploadResult(result)
      
      if (result.data) {
        console.log('Upload successful:', result.data)
      }
    } catch (error) {
      setUploadResult({ error })
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setUploadResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upload Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Test image upload functionality to Supabase Storage
          </p>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 mb-8"
        >
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-6">
                <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {selectedFile.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedFile.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex space-x-4 justify-center">
                  <motion.button
                    onClick={handleUpload}
                    disabled={uploading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload Image</span>
                      </>
                    )}
                  </motion.button>
                  <button
                    onClick={resetUpload}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl mx-auto flex items-center justify-center">
                  <Upload className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Drop your image here
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or click to browse files
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports: PNG, JPG, WebP • Max size: 10MB
                  </p>
                </div>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </motion.div>

        {/* Upload Result */}
        {uploadResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            {uploadResult.error ? (
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                    Upload Failed
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mb-3">
                    {uploadResult.error.message}
                  </p>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                    <pre className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap">
                      {JSON.stringify(uploadResult.error, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : uploadResult.data ? (
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Upload Successful!
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Public URL:</p>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                          {uploadResult.data.publicUrl}
                        </code>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">File Path:</p>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <code className="text-sm text-gray-800 dark:text-gray-200">
                          {uploadResult.data.path}
                        </code>
                      </div>
                    </div>
                    {uploadResult.data.publicUrl && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                        <img
                          src={uploadResult.data.publicUrl}
                          alt="Uploaded image"
                          className="w-48 h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Unexpected Response
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                    <pre className="text-sm text-yellow-800 dark:text-yellow-200 whitespace-pre-wrap">
                      {JSON.stringify(uploadResult, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mt-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            How it works
          </h3>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>• Select an image file or drag and drop it into the upload area</p>
            <p>• Click "Upload Image" to upload the file to Supabase Storage</p>
            <p>• The uploaded file will be stored in the "product-images" bucket</p>
            <p>• A public URL will be generated for accessing the image</p>
            <p>• Use this URL in your product forms for image display</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}