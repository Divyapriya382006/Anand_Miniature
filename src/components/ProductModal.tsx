import React, { useState } from 'react';
import { Product, Review } from '../types';
import { X, Star, MessageCircle, User, Calendar, Camera } from 'lucide-react';
import { addReview } from '../utils/database';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdate?: (updatedProduct: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  isOpen, 
  onClose,
  onProductUpdate 
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    text: '',
    images: [] as string[]
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setReviewForm(prev => ({
            ...prev,
            images: [...prev.images, base64]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.text.trim()) return;
    
    setIsSubmittingReview(true);
    try {
      const updatedProduct = addReview(product, {
        name: reviewForm.name || 'Anonymous',
        rating: reviewForm.rating,
        text: reviewForm.text,
        images: reviewForm.images
      });
      
      onProductUpdate?.(updatedProduct);
      setReviewForm({ name: '', rating: 5, text: '', images: [] });
      setActiveTab('reviews');
    } catch (error) {
      console.error('Failed to add review:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleContactSeller = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in "${product.name}" (₹${product.price}). Is it available?`
    );
    const whatsappUrl = `https://wa.me/1234567890?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={interactive && onRate ? () => onRate(index + 1) : undefined}
        disabled={!interactive}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
      >
        <Star
          className={`w-5 h-5 ${
            index < rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      </button>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.images[0] || '/api/placeholder/400/400'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {product.stock_count} in stock
                  </span>
                </div>
                
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  ₹{product.price}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {renderStars(product.rating.avg)}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {product.rating.avg.toFixed(1)} ({product.rating.count} reviews)
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {product.description}
                </p>

                <button
                  onClick={handleContactSeller}
                  disabled={product.stock_count === 0}
                  className={`w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                    product.stock_count === 0
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  {product.stock_count === 0 ? 'Out of Stock — DM to Request Restock' : 'DM to Buy'}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              {['details', 'reviews', 'add-review'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'details' && 'Details'}
                  {tab === 'reviews' && `Reviews (${product.reviews.length})`}
                  {tab === 'add-review' && 'Add Review'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Category:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">{product.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Stock:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">{product.stock_count} units</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Price:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">₹{product.price}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Added:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">{formatDate(product.created_at)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Rating Breakdown</h4>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = product.rating.breakdown[rating.toString()] || 0;
                        const percentage = product.rating.count > 0 ? (count / product.rating.count) * 100 : 0;
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {product.reviews.length > 0 ? (
                    product.reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {review.name || 'Anonymous'}
                              </span>
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(review.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-3">{review.text}</p>
                            {review.images && review.images.length > 0 && (
                              <div className="grid grid-cols-4 gap-2">
                                {review.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'add-review' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {renderStars(reviewForm.rating, true, (rating) => 
                        setReviewForm(prev => ({ ...prev, rating }))
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Review
                    </label>
                    <textarea
                      value={reviewForm.text}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                      rows={4}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Share your experience..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Photos (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Camera className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Add Photos</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {reviewForm.images.length > 0 && (
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {reviewForm.images.length} photo(s) added
                        </span>
                      )}
                    </div>
                    {reviewForm.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {reviewForm.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => setReviewForm(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }))}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    disabled={!reviewForm.text.trim() || isSubmittingReview}
                    className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;