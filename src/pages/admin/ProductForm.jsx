import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadProductImage, validateImage } from '../../utils/ImageUpload';
import { Button, Input } from '../../components/ui';
import { useToast } from '../../components/ui';

const ProductForm = () => {
  const { id } = useParams(); // If editing, id will be present
  const navigate = useNavigate();
  const toast = useToast();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: 'clothes',
    price: '',
    description: ''
  });

  const [sizes, setSizes] = useState([{ size: 'S', stock: 0 }]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load existing product if editing
  useEffect(() => {
    if (isEditing) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name,
          category: data.category,
          price: data.price.toString(),
          description: data.description
        });
        setSizes(data.sizes || [{ size: 'S', stock: 0 }]);
        setExistingImages(data.images || []);
        setColors(data.colors || []);
      } else {
        toast.error('Product not found');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate each image
    for (const file of files) {
      const validation = validateImage(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
    }
    
    setNewImages([...newImages, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const addSize = () => {
    setSizes([...sizes, { size: '', stock: 0 }]);
  };

  const updateSize = (index, field, value) => {
    const updated = [...sizes];
    updated[index][field] = field === 'stock' ? parseInt(value) || 0 : value;
    setSizes(updated);
  };

  const removeSize = (index) => {
    if (sizes.length > 1) {
      setSizes(sizes.filter((_, i) => i !== index));
    }
  };

  const addColor = () => {
    setColors([...colors, { name: '', hex: '#000000' }]);
  };

  const updateColor = (index, field, value) => {
    const updated = [...colors];
    updated[index][field] = value;
    setColors(updated);
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    if (sizes.some(s => !s.size.trim())) {
      toast.error('All sizes must have a name');
      return;
    }

    setUploading(true);

    try {
      // Generate product ID if new
      const productId = isEditing ? id : doc(collection(db, 'products')).id;

      // Upload new images
      const uploadedUrls = [];
      for (const file of newImages) {
        toast.info(`Uploading ${file.name}...`);
        const url = await uploadProductImage(file, productId);
        uploadedUrls.push(url);
      }

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...uploadedUrls];

      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        images: allImageUrls,
        sizes: sizes.map(s => ({
          size: s.size.trim(),
          stock: s.stock
        })),
        colors: colors.length > 0 ? colors.map(c => ({
          name: c.name.trim(),
          hex: c.hex
        })) : [],
        averageRating: 0,
        reviewCount: 0
      };

      if (isEditing) {
        // Update existing product
        await updateDoc(doc(db, 'products', id), {
          ...productData,
          updatedAt: new Date().toISOString()
        });
        toast.success('Product updated successfully!');
      } else {
        // Create new product
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString()
        });
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>
        <h1 className="font-serif text-3xl font-semibold">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Basic Information */}
        <div className="bg-white border border-stone-200 p-6">
          <h2 className="text-xl font-serif font-semibold mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <Input
              label="Product Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Premium Cotton T-Shirt"
              required
            />

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:border-stone-900"
              >
                <option value="clothes">Clothes</option>
                <option value="bags">Bags</option>
                <option value="shoes">Shoes</option>
              </select>
            </div>

            <Input
              label="Price (₦)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="8500"
              required
            />

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:border-stone-900"
                placeholder="Describe the product..."
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-stone-200 p-6">
          <h2 className="text-xl font-serif font-semibold mb-6">Product Images</h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-stone-600 mb-3">Current Images</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full aspect-square object-cover bg-stone-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Preview */}
          {newImages.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-stone-600 mb-3">New Images to Upload</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${index + 1}`}
                      className="w-full aspect-square object-cover bg-stone-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Input */}
          <div className="border-2 border-dashed border-stone-300 p-8 text-center">
            <input
              type="file"
              id="images"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="images"
              className="cursor-pointer"
            >
              <svg className="w-12 h-12 mx-auto text-stone-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-stone-900 font-medium mb-1">Click to upload images</p>
              <p className="text-sm text-stone-500">JPG, PNG or WebP (max 5MB each)</p>
            </label>
          </div>
        </div>

        {/* Sizes & Stock */}
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-semibold">Sizes & Stock</h2>
            <button
              type="button"
              onClick={addSize}
              className="text-sm text-stone-900 hover:underline"
            >
              + Add Size
            </button>
          </div>

          <div className="space-y-4">
            {sizes.map((size, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    label={index === 0 ? "Size" : ""}
                    type="text"
                    value={size.size}
                    onChange={(e) => updateSize(index, 'size', e.target.value)}
                    placeholder="S, M, L, 40, 41, One Size, etc."
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label={index === 0 ? "Stock" : ""}
                    type="number"
                    value={size.stock}
                    onChange={(e) => updateSize(index, 'stock', e.target.value)}
                    placeholder="10"
                  />
                </div>
                {sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className={`text-red-600 hover:text-red-800 ${index === 0 ? 'mt-8' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Colors (Optional) */}
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-serif font-semibold">Colors (Optional)</h2>
              <p className="text-sm text-stone-600 mt-1">Add colors if this product has color variations</p>
            </div>
            <button
              type="button"
              onClick={addColor}
              className="text-sm text-stone-900 hover:underline"
            >
              + Add Color
            </button>
          </div>

          {colors.length > 0 ? (
            <div className="space-y-4">
              {colors.map((color, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Input
                      label={index === 0 ? "Color Name" : ""}
                      type="text"
                      value={color.name}
                      onChange={(e) => updateColor(index, 'name', e.target.value)}
                      placeholder="e.g., Black, White, Navy Blue"
                    />
                  </div>
                  <div className="flex-1">
                    <label className={`block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium ${index === 0 ? '' : 'invisible'}`}>
                      Color Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateColor(index, 'hex', e.target.value)}
                        className="w-16 h-12 border border-stone-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color.hex}
                        onChange={(e) => updateColor(index, 'hex', e.target.value)}
                        className="flex-1 px-4 py-3 border border-stone-300 focus:outline-none focus:border-stone-900"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className={`text-red-600 hover:text-red-800 mb-3`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500 italic text-center py-4">
              No colors added. This product will not have color options.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            loading={uploading}
            className="flex-1"
          >
            {uploading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/products')}
            disabled={uploading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;