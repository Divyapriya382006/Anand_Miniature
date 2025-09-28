import React, { useState } from 'react';
import { Product, DatabaseSchema } from '../types';
import { generateId, recordSale, hashPin } from '../utils/database';
import { Plus, CreditCard as Edit, Trash2, DollarSign, Package, TrendingUp, Save, Download, Upload, Eye, EyeOff, LogOut, ShoppingCart } from 'lucide-react';

interface AdminDashboardProps {
  database: DatabaseSchema;
  onDatabaseUpdate: (database: DatabaseSchema) => void;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  database,
  onDatabaseUpdate,
  isAuthenticated,
  onLogin,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loginPin, setLoginPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    currency: 'INR',
    description: '',
    stock_count: 0,
    images: []
  });

  // Login form
  const handleLogin = async () => {
    if (!loginPin) return;
    
    const hashedPin = await hashPin(loginPin);
    if (hashedPin === database.settings.admin_pin_hash) {
      onLogin();
      setLoginPin('');
    } else {
      alert('Invalid PIN');
    }
  };

  const handleSetPin = async () => {
    const pin = prompt('Set your admin PIN (remember this!):');
    if (pin && pin.length >= 4) {
      const hashedPin = await hashPin(pin);
      const updatedDb = {
        ...database,
        settings: {
          ...database.settings,
          admin_pin_hash: hashedPin
        }
      };
      onDatabaseUpdate(updatedDb);
      alert('PIN set successfully!');
    }
  };

  // Product management
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.description) {
      alert('Please fill in all required fields');
      return;
    }

    const product: Product = {
      id: generateId(),
      slug: newProduct.name!.toLowerCase().replace(/\s+/g, '-'),
      name: newProduct.name!,
      category: newProduct.category!,
      price: newProduct.price!,
      currency: newProduct.currency!,
      description: newProduct.description!,
      stock_count: newProduct.stock_count!,
      images: newProduct.images!,
      units_sold: 0,
      total_revenue: 0,
      created_at: new Date().toISOString(),
      rating: {
        avg: 0,
        count: 0,
        breakdown: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      },
      reviews: []
    };

    const updatedDb = {
      ...database,
      products: [...database.products, product]
    };

    onDatabaseUpdate(updatedDb);
    setNewProduct({
      name: '',
      category: '',
      price: 0,
      currency: 'INR',
      description: '',
      stock_count: 0,
      images: []
    });
    setShowAddForm(false);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const updatedDb = {
      ...database,
      products: database.products.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      )
    };

    onDatabaseUpdate(updatedDb);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedDb = {
        ...database,
        products: database.products.filter(p => p.id !== productId)
      };
      onDatabaseUpdate(updatedDb);
    }
  };

  const handleRecordSale = (product: Product, quantity: number = 1) => {
    try {
      const updatedProduct = recordSale(product, quantity);
      const updatedDb = {
        ...database,
        products: database.products.map(p => 
          p.id === product.id ? updatedProduct : p
        )
      };
      onDatabaseUpdate(updatedDb);
      alert(`Sale recorded! ${quantity} unit(s) of ${product.name}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error recording sale');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          if (isEditing && editingProduct) {
            setEditingProduct({
              ...editingProduct,
              images: [...editingProduct.images, base64]
            });
          } else {
            setNewProduct(prev => ({
              ...prev,
              images: [...(prev.images || []), base64]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Statistics
  const totalProducts = database.products.length;
  const totalRevenue = database.products.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
  const totalSales = database.products.reduce((sum, p) => sum + (p.units_sold || 0), 0);
  const averageRating = database.products.length > 0 
    ? database.products.reduce((sum, p) => sum + p.rating.avg, 0) / database.products.length 
    : 0;

  if (!isAuthenticated) {
    return (
      <section id="admin" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Admin Login
            </h2>
            
            {!database.settings.admin_pin_hash ? (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  No admin PIN set. Set one to get started.
                </p>
                <button
                  onClick={handleSetPin}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Set Admin PIN
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your PIN"
                    />
                    <button
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleLogin}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="admin" className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Admin Dashboard
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add a new cutie
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
                  </div>
                  <Package className="w-12 h-12 text-pink-500" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Units Sold</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalSales}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Avg Rating</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Product Management */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Product Management
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {database.products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.images[0] || '/api/placeholder/40/40'}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ★ {product.rating.avg.toFixed(1)} ({product.rating.count})
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {product.stock_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {product.units_sold}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ₹{product.total_revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => {
                              const qty = prompt('Enter quantity to sell:', '1');
                              if (qty && parseInt(qty) > 0) {
                                handleRecordSale(product, parseInt(qty));
                              }
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                            title="Record Sale"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Add Product Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Add New Product
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={newProduct.category || ''}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      value={newProduct.price || 0}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      value={newProduct.stock_count || 0}
                      onChange={(e) => setNewProduct({...newProduct, stock_count: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {newProduct.images && newProduct.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {newProduct.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Add Product
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Form */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Product
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      value={editingProduct.stock_count}
                      onChange={(e) => setEditingProduct({...editingProduct, stock_count: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add More Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {editingProduct.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {editingProduct.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setEditingProduct({
                              ...editingProduct,
                              images: editingProduct.images.filter((_, i) => i !== index)
                            })}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleUpdateProduct}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Update Product
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;