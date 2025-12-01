import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { create } from 'zustand'
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react'

import logo from './assets/logo.png'

// Zustand Store
const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id)
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] }
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
}))

// Mock API for Products
const fetchProducts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    {
      id: 1,
      name: 'Silk Saree with Golden Border',
      price: 4999,
      category: 'Sarees',
      fabric: 'Silk',
      color: 'Red',
      occasion: 'Wedding',
      rating: 4.8,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-red-200 to-pink-300',
      description:
        'Elegant silk saree with intricate golden border perfect for weddings and special occasions.',
    },
    {
      id: 2,
      name: 'Banarasi Saree',
      price: 8999,
      category: 'Sarees',
      fabric: 'Banarasi Silk',
      color: 'Gold',
      occasion: 'Wedding',
      rating: 4.9,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-amber-200 to-orange-300',
      description: 'Traditional Banarasi silk saree with rich zari work.',
    },
    {
      id: 3,
      name: 'Anarkali Suit Set',
      price: 3499,
      category: 'Suits',
      fabric: 'Georgette',
      color: 'Purple',
      occasion: 'Party',
      rating: 4.7,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-purple-200 to-pink-300',
      description: 'Flowy Anarkali suit with embroidered work.',
    },
    {
      id: 4,
      name: 'Bridal Lehenga Choli',
      price: 12999,
      category: 'Lehengas',
      fabric: 'Velvet',
      color: 'Red',
      occasion: 'Wedding',
      rating: 4.9,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-red-200 to-pink-400',
      description: 'Heavy embroidered bridal lehenga with dupatta.',
    },
    {
      id: 5,
      name: 'Cotton Palazzo Suit',
      price: 2499,
      category: 'Suits',
      fabric: 'Cotton',
      color: 'Blue',
      occasion: 'Casual',
      rating: 4.6,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-blue-200 to-cyan-300',
      description: 'Comfortable cotton palazzo suit for everyday wear.',
    },
    {
      id: 6,
      name: 'Designer Kurti Set',
      price: 1799,
      category: 'Kurtis',
      fabric: 'Rayon',
      color: 'Green',
      occasion: 'Casual',
      rating: 4.5,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-green-200 to-emerald-300',
      description: 'Trendy kurti with modern prints and palazzo.',
    },
    {
      id: 7,
      name: 'Chanderi Silk Saree',
      price: 6999,
      category: 'Sarees',
      fabric: 'Chanderi',
      color: 'Pink',
      occasion: 'Festive',
      rating: 4.8,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-pink-200 to-rose-300',
      description: 'Lightweight Chanderi silk saree with elegant motifs.',
    },
    {
      id: 8,
      name: 'Printed Cotton Kurti',
      price: 999,
      category: 'Kurtis',
      fabric: 'Cotton',
      color: 'Yellow',
      occasion: 'Casual',
      rating: 4.4,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-yellow-200 to-amber-300',
      description: 'Casual printed kurti for daily wear.',
    },
    {
      id: 9,
      name: 'Net Lehenga',
      price: 7999,
      category: 'Lehengas',
      fabric: 'Net',
      color: 'Purple',
      occasion: 'Party',
      rating: 4.7,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-purple-200 to-fuchsia-300',
      description: 'Elegant net lehenga with sequin work.',
    },
    {
      id: 10,
      name: 'Georgette Anarkali',
      price: 4299,
      category: 'Suits',
      fabric: 'Georgette',
      color: 'Pink',
      occasion: 'Party',
      rating: 4.6,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-pink-200 to-rose-300',
      description: 'Stylish georgette anarkali with stone work.',
    },
    {
      id: 11,
      name: 'Cotton Saree',
      price: 1499,
      category: 'Sarees',
      fabric: 'Cotton',
      color: 'Blue',
      occasion: 'Casual',
      rating: 4.5,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-blue-200 to-indigo-300',
      description: 'Pure cotton saree for comfortable daily wear.',
    },
    {
      id: 12,
      name: 'Party Wear Lehenga',
      price: 9999,
      category: 'Lehengas',
      fabric: 'Silk',
      color: 'Gold',
      occasion: 'Party',
      rating: 4.8,
      image: '👗',
      bgColor: 'bg-gradient-to-br from-amber-200 to-yellow-300',
      description: 'Stunning party wear lehenga with mirror work.',
    },
  ]
}

// Mock API for Filters
const fetchFilters = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    categories: ['Sarees', 'Lehengas', 'Suits', 'Kurtis'],
    fabrics: [
      'Silk',
      'Cotton',
      'Georgette',
      'Velvet',
      'Net',
      'Banarasi Silk',
      'Chanderi',
      'Rayon',
    ],
    colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Gold'],
    occasions: ['Wedding', 'Party', 'Casual', 'Festive'],
    priceRanges: [
      { label: 'Under ₹2000', min: 0, max: 2000 },
      { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
      { label: '₹5000 - ₹10000', min: 5000, max: 10000 },
      { label: 'Above ₹10000', min: 10000, max: Infinity },
    ],
  }
}

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const cart = useCartStore((state) => state.cart)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const menuItems = [
    {
      name: 'Sarees',
      submenu: [
        'Silk Sarees',
        'Cotton Sarees',
        'Designer Sarees',
        'Banarasi Sarees',
        'Kanjivaram Sarees',
      ],
    },
    {
      name: 'Lehengas',
      submenu: [
        'Bridal Lehengas',
        'Party Wear',
        'Designer Lehengas',
        'Silk Lehengas',
      ],
    },
    {
      name: 'Suits',
      submenu: [
        'Anarkali Suits',
        'Palazzo Suits',
        'Salwar Suits',
        'Churidar Suits',
      ],
    },
    {
      name: 'Kurtis',
      submenu: [
        'Cotton Kurtis',
        'Designer Kurtis',
        'Printed Kurtis',
        'Long Kurtis',
      ],
    },
  ]

  return (
    <nav className='bg-white shadow-sm sticky top-0 z-50 border-b border-pink-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='md:hidden mr-4'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <a href='/'>
              <img
                src={logo}
                alt='Logo'
                className='h-20 md:h-24 object-contain'
              />
            </a>
          </div>

          <div className='hidden md:flex space-x-6 relative'>
            {menuItems.map((item) => (
              <div
                key={item.name}
                className='relative'
                onMouseEnter={() => setActiveMenu(item.name)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className='text-gray-700 hover:text-pink-600 transition font-medium flex items-center'>
                  {item.name}
                  <ChevronDown size={16} className='ml-1' />
                </button>

                {activeMenu === item.name && (
                  <div className='absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-48 border border-pink-100'>
                    {item.submenu.map((sub) => (
                      <a
                        key={sub}
                        href='#'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition'
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href='#'
              className='text-pink-600 hover:text-pink-700 transition font-bold'
            >
              Sale
            </a>
          </div>

          <div className='flex items-center space-x-4'>
            <button className='text-gray-700 hover:text-pink-600 transition'>
              <Search size={20} />
            </button>
            <button className='text-gray-700 hover:text-pink-600 transition'>
              <Heart size={20} />
            </button>
            <button className='text-gray-700 hover:text-pink-600 transition'>
              <User size={20} />
            </button>
            <button className='relative text-gray-700 hover:text-pink-600 transition'>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className='absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className='md:hidden border-t border-pink-100'>
          <div className='px-4 pt-2 pb-3 space-y-1 bg-pink-50/50'>
            {menuItems.map((item) => (
              <div key={item.name}>
                <a
                  href='#'
                  className='block px-3 py-2 text-gray-700 hover:bg-pink-100 rounded font-medium'
                >
                  {item.name}
                </a>
              </div>
            ))}
            <a
              href='#'
              className='block px-3 py-2 text-pink-600 hover:bg-pink-100 rounded font-bold'
            >
              Sale
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

// Filter Sidebar Component
const FilterSidebar = ({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    fabric: true,
    color: true,
    occasion: true,
    price: true,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const FilterSection = ({ title, items, filterKey }) => (
    <div className='border-b border-pink-100 py-4'>
      <button
        onClick={() => toggleSection(filterKey)}
        className='flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3'
      >
        {title}
        {expandedSections[filterKey] ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>
      {expandedSections[filterKey] && (
        <div className='space-y-2'>
          {items.map((item) => (
            <label
              key={item}
              className='flex items-center space-x-2 cursor-pointer hover:text-pink-600 transition'
            >
              <input
                type='checkbox'
                checked={selectedFilters[filterKey]?.includes(item) || false}
                onChange={(e) =>
                  onFilterChange(filterKey, item, e.target.checked)
                }
                className='w-4 h-4 text-pink-600 rounded focus:ring-pink-500'
              />
              <span className='text-sm text-gray-700'>{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className='bg-white rounded-lg shadow-md p-4 sticky top-20'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-bold text-gray-800 flex items-center'>
          <SlidersHorizontal size={20} className='mr-2' />
          Filters
        </h3>
        {Object.keys(selectedFilters).some(
          (key) => selectedFilters[key]?.length > 0
        ) && (
          <button
            onClick={onClearFilters}
            className='text-sm text-pink-600 hover:text-pink-700 font-semibold'
          >
            Clear All
          </button>
        )}
      </div>

      <FilterSection
        title='Category'
        items={filters.categories}
        filterKey='category'
      />
      <FilterSection
        title='Fabric'
        items={filters.fabrics}
        filterKey='fabric'
      />
      <FilterSection title='Color' items={filters.colors} filterKey='color' />
      <FilterSection
        title='Occasion'
        items={filters.occasions}
        filterKey='occasion'
      />

      <div className='border-b border-pink-100 py-4'>
        <button
          onClick={() => toggleSection('price')}
          className='flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3'
        >
          Price Range
          {expandedSections.price ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        {expandedSections.price && (
          <div className='space-y-2'>
            {filters.priceRanges.map((range) => (
              <label
                key={range.label}
                className='flex items-center space-x-2 cursor-pointer hover:text-pink-600 transition'
              >
                <input
                  type='checkbox'
                  checked={
                    selectedFilters.priceRange?.includes(range.label) || false
                  }
                  onChange={(e) =>
                    onFilterChange('priceRange', range.label, e.target.checked)
                  }
                  className='w-4 h-4 text-pink-600 rounded focus:ring-pink-500'
                />
                <span className='text-sm text-gray-700'>{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Selected Filters Bar
const SelectedFiltersBar = ({ selectedFilters, onRemoveFilter }) => {
  const allFilters = Object.entries(selectedFilters).flatMap(([key, values]) =>
    values.map((value) => ({ key, value }))
  )

  if (allFilters.length === 0) return null

  return (
    <div className='bg-pink-50 rounded-lg p-3 mb-4'>
      <div className='flex flex-wrap gap-2'>
        {allFilters.map(({ key, value }) => (
          <span
            key={`${key}-${value}`}
            className='inline-flex items-center bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-pink-200'
          >
            {value}
            <button
              onClick={() => onRemoveFilter(key, value)}
              className='ml-2 text-pink-600 hover:text-pink-700'
            >
              <XCircle size={16} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

// Product Card
const ProductCard = ({ product, onViewDetails }) => {
  const addToCart = useCartStore((state) => state.addToCart)
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div
      onClick={() => onViewDetails(product)}
      className='bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition cursor-pointer group'
    >
      <div
        className={`${product.bgColor} h-56 flex items-center justify-center text-6xl relative overflow-hidden`}
      >
        <div className='text-7xl transform group-hover:scale-110 transition'>
          {product.image}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
          }}
          className='absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-pink-50 transition'
        >
          <Heart size={16} className='text-pink-500' />
        </button>
      </div>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs text-pink-600 uppercase font-semibold'>
            {product.category}
          </span>
          <div className='flex items-center bg-green-50 px-2 py-1 rounded'>
            <Star size={12} className='text-green-600 fill-current' />
            <span className='text-xs ml-1 font-semibold text-green-600'>
              {product.rating}
            </span>
          </div>
        </div>
        <h4 className='font-semibold text-base mb-2 text-gray-800 line-clamp-2'>
          {product.name}
        </h4>
        <p className='text-xs text-gray-500 mb-3'>
          {product.fabric} • {product.color}
        </p>
        <div className='flex items-center justify-between'>
          <span className='text-xl font-bold text-pink-600'>
            ₹{product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition transform hover:scale-105 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
            }`}
          >
            {added ? '✓ Added' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Product Detail Modal
const ProductDetailModal = ({ product, onClose }) => {
  const addToCart = useCartStore((state) => state.addToCart)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product) return null

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='grid md:grid-cols-2 gap-6 p-6'>
          <div
            className={`${product.bgColor} rounded-xl h-96 flex items-center justify-center text-9xl`}
          >
            {product.image}
          </div>

          <div>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <span className='text-sm text-pink-600 uppercase font-semibold'>
                  {product.category}
                </span>
                <h2 className='text-2xl font-bold text-gray-800 mt-1'>
                  {product.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>

            <div className='flex items-center mb-4'>
              <div className='flex items-center bg-green-50 px-3 py-1 rounded'>
                <Star size={16} className='text-green-600 fill-current' />
                <span className='text-sm ml-1 font-semibold text-green-600'>
                  {product.rating}
                </span>
              </div>
              <span className='text-sm text-gray-500 ml-3'>(150 reviews)</span>
            </div>

            <div className='text-3xl font-bold text-pink-600 mb-4'>
              ₹{product.price.toLocaleString()}
            </div>

            <p className='text-gray-600 mb-6'>{product.description}</p>

            <div className='space-y-3 mb-6'>
              <div className='flex items-center'>
                <span className='font-semibold text-gray-800 w-24'>
                  Fabric:
                </span>
                <span className='text-gray-600'>{product.fabric}</span>
              </div>
              <div className='flex items-center'>
                <span className='font-semibold text-gray-800 w-24'>Color:</span>
                <span className='text-gray-600'>{product.color}</span>
              </div>
              <div className='flex items-center'>
                <span className='font-semibold text-gray-800 w-24'>
                  Occasion:
                </span>
                <span className='text-gray-600'>{product.occasion}</span>
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
                }`}
              >
                {added ? '✓ Added to Bag' : 'Add to Bag'}
              </button>
              <button className='px-6 py-3 rounded-lg font-semibold border-2 border-pink-500 text-pink-600 hover:bg-pink-50 transition'>
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className='flex items-center justify-center gap-2 mt-8'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
      >
        Previous
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className='px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition'
          >
            1
          </button>
          {start > 2 && <span className='text-gray-400'>...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg transition ${
            currentPage === page
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
              : 'border border-pink-200 text-gray-700 hover:bg-pink-50'
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className='text-gray-400'>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className='px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition'
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
      >
        Next
      </button>
    </div>
  )
}

// Main Listing Page Component
const ListingPage = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    fabric: [],
    color: [],
    occasion: [],
    priceRange: [],
  })
  const [sortBy, setSortBy] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const itemsPerPage = 9

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const { data: filters, isLoading: filtersLoading } = useQuery({
    queryKey: ['filters'],
    queryFn: fetchFilters,
  })

  const handleFilterChange = (filterKey, value, checked) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: checked
        ? [...(prev[filterKey] || []), value]
        : (prev[filterKey] || []).filter((v) => v !== value),
    }))
    setCurrentPage(1)
  }

  const handleRemoveFilter = (filterKey, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: (prev[filterKey] || []).filter((v) => v !== value),
    }))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedFilters({
      category: [],
      fabric: [],
      color: [],
      occasion: [],
      priceRange: [],
    })
    setCurrentPage(1)
  }

  const filteredProducts = useMemo(() => {
    if (!products) return []

    let filtered = [...products]

    if (selectedFilters.category.length > 0) {
      filtered = filtered.filter((p) =>
        selectedFilters.category.includes(p.category)
      )
    }
    if (selectedFilters.fabric.length > 0) {
      filtered = filtered.filter((p) =>
        selectedFilters.fabric.includes(p.fabric)
      )
    }
    if (selectedFilters.color.length > 0) {
      filtered = filtered.filter((p) => selectedFilters.color.includes(p.color))
    }
    if (selectedFilters.occasion.length > 0) {
      filtered = filtered.filter((p) =>
        selectedFilters.occasion.includes(p.occasion)
      )
    }
    if (selectedFilters.priceRange.length > 0 && filters) {
      filtered = filtered.filter((p) => {
        return selectedFilters.priceRange.some((rangeLabel) => {
          const range = filters.priceRanges.find((r) => r.label === rangeLabel)
          return p.price >= range.min && p.price <= range.max
        })
      })
    }

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered
  }, [products, selectedFilters, sortBy, filters])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (productsLoading || filtersLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-white to-pink-50'>
        <Navbar />
        <div className='flex items-center justify-center h-96'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600'></div>
            <p className='mt-4 text-gray-600'>Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-pink-50'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Women's Ethnic Wear
          </h1>
          <p className='text-gray-600'>
            {filteredProducts.length} products found
          </p>
        </div>

        <div className='flex gap-6'>
          {/* Left Sidebar - Filters */}
          <div className='hidden lg:block w-64 flex-shrink-0'>
            {filters && (
              <FilterSidebar
                filters={filters}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            )}
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Selected Filters Bar */}
            <SelectedFiltersBar
              selectedFilters={selectedFilters}
              onRemoveFilter={handleRemoveFilter}
            />

            {/* Sorting and View Options */}
            <div className='flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400'
                >
                  <option value='featured'>Featured</option>
                  <option value='price-low'>Price: Low to High</option>
                  <option value='price-high'>Price: High to Low</option>
                  <option value='rating'>Highest Rated</option>
                </select>
              </div>

              <div className='text-sm text-gray-600'>
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={setSelectedProduct}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className='text-center py-16 bg-white rounded-lg'>
                <p className='text-gray-600 text-lg'>
                  No products found matching your filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className='mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition'
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

// Main App
const queryClient = new QueryClient()

const ProductsListing = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ListingPage />
    </QueryClientProvider>
  )
}

export default ProductsListing
