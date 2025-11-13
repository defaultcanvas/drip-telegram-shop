'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Eye, MoreVertical, Star, Heart, ShoppingCart } from 'lucide-react'

export default function ProductCard({ product, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)
  const [isLoved, setIsLoved] = useState(false)

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'coffee': return '☕'
      case 'tea': return '🍵'
      case 'pastry': return '🥐'
      case 'sandwich': return '🥪'
      case 'drink': return '🥤'
      default: return '🍽️'
    }
  }

  const handleLove = (e) => {
    e.stopPropagation()
    setIsLoved(!isLoved)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
    >
      {/* Love Button */}
      <motion.button
        onClick={handleLove}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-lg"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isLoved ? 'text-red-500 fill-red-500' : 'text-gray-400'
          }`}
        />
      </motion.button>

      {/* Product Image */}
      <div className="relative mb-4">
        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-50">
                {getCategoryEmoji(product.category)}
              </span>
            </div>
          )}
        </div>
        
        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
            <span>{getCategoryEmoji(product.category)}</span>
            <span className="capitalize">{product.category}</span>
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
            {product.name}
          </h3>
          <div className="text-right">
            <p className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              ${product.price}
            </p>
          </div>
        </div>
        
        {product.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Rating & Stats */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
          <div className="flex items-center space-x-1">
            <ShoppingCart className="w-3 h-3" />
            <span>124 sold</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onEdit(product)}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center space-x-2"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMenu(!showMenu)}
          className="px-3 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl transition-all relative"
        >
          <MoreVertical className="w-4 h-4" />
          
          {/* Dropdown Menu */}
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1 z-20"
            >
              <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => {
                  onDelete(product.id)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
    </motion.div>
  )
}