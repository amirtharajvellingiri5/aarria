import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { create } from 'zustand'
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Heart,
  Star,
  ArrowRight,
} from 'lucide-react'

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
  clearCart: () => set({ cart: [] }),
}))

// Mock API
const fetchProducts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 79.99,
      category: 'Electronics',
      rating: 4.5,
      image: '🎧',
      featured: true,
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      category: 'Electronics',
      rating: 4.8,
      image: '⌚',
      featured: true,
    },
    {
      id: 3,
      name: 'Laptop Backpack',
      price: 49.99,
      category: 'Accessories',
      rating: 4.3,
      image: '🎒',
      featured: false,
    },
    {
      id: 4,
      name: 'USB-C Cable',
      price: 12.99,
      category: 'Accessories',
      rating: 4.6,
      image: '🔌',
      featured: false,
    },
    {
      id: 5,
      name: 'Portable Charger',
      price: 34.99,
      category: 'Electronics',
      rating: 4.7,
      image: '🔋',
      featured: true,
    },
    {
      id: 6,
      name: 'Bluetooth Speaker',
      price: 59.99,
      category: 'Electronics',
      rating: 4.4,
      image: '🔊',
      featured: true,
    },
  ]
}

// Components
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const cart = useCartStore((state) => state.cart)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='md:hidden mr-4'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className='text-2xl font-bold text-indigo-600'>ShopHub</h1>
          </div>

          <div className='hidden md:flex space-x-8'>
            <a
              href='#'
              className='text-gray-700 hover:text-indigo-600 transition'
            >
              Home
            </a>
            <a
              href='#'
              className='text-gray-700 hover:text-indigo-600 transition'
            >
              Shop
            </a>
            <a
              href='#'
              className='text-gray-700 hover:text-indigo-600 transition'
            >
              Categories
            </a>
            <a
              href='#'
              className='text-gray-700 hover:text-indigo-600 transition'
            >
              About
            </a>
          </div>

          <div className='flex items-center space-x-4'>
            <button className='text-gray-700 hover:text-indigo-600 transition'>
              <Search size={20} />
            </button>
            <button className='text-gray-700 hover:text-indigo-600 transition'>
              <Heart size={20} />
            </button>
            <button className='relative text-gray-700 hover:text-indigo-600 transition'>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className='md:hidden border-t'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            <a
              href='#'
              className='block px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded'
            >
              Home
            </a>
            <a
              href='#'
              className='block px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded'
            >
              Shop
            </a>
            <a
              href='#'
              className='block px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded'
            >
              Categories
            </a>
            <a
              href='#'
              className='block px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded'
            >
              About
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

const Hero = () => {
  return (
    <div className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='text-center'>
          <h2 className='text-4xl md:text-6xl font-bold mb-4'>
            Summer Sale 2024
          </h2>
          <p className='text-xl md:text-2xl mb-8'>
            Up to 50% off on selected items
          </p>
          <button className='bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition inline-flex items-center'>
            Shop Now <ArrowRight className='ml-2' size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

const Categories = () => {
  const categories = [
    { name: 'Electronics', icon: '💻', color: 'bg-blue-100 text-blue-600' },
    { name: 'Fashion', icon: '👕', color: 'bg-pink-100 text-pink-600' },
    { name: 'Home & Living', icon: '🏠', color: 'bg-green-100 text-green-600' },
    { name: 'Sports', icon: '⚽', color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h3 className='text-3xl font-bold mb-8 text-center'>Shop by Category</h3>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`${cat.color} p-6 rounded-lg text-center cursor-pointer hover:scale-105 transition transform`}
          >
            <div className='text-4xl mb-2'>{cat.icon}</div>
            <h4 className='font-semibold'>{cat.name}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition'>
      <div className='bg-gray-100 h-48 flex items-center justify-center text-6xl'>
        {product.image}
      </div>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs text-gray-500 uppercase'>
            {product.category}
          </span>
          <div className='flex items-center'>
            <Star size={14} className='text-yellow-400 fill-current' />
            <span className='text-sm ml-1'>{product.rating}</span>
          </div>
        </div>
        <h4 className='font-semibold text-lg mb-2'>{product.name}</h4>
        <div className='flex items-center justify-between'>
          <span className='text-2xl font-bold text-indigo-600'>
            ${product.price}
          </span>
          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

const Products = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
          <p className='mt-4 text-gray-600'>Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-12 text-red-500'>
        Error loading products
      </div>
    )
  }

  const featured = products.filter((p) => p.featured)

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h3 className='text-3xl font-bold mb-8'>Featured Products</h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white mt-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h4 className='text-xl font-bold mb-4'>ShopHub</h4>
            <p className='text-gray-400'>
              Your one-stop shop for everything you need.
            </p>
          </div>
          <div>
            <h5 className='font-semibold mb-4'>Shop</h5>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <a href='#' className='hover:text-white transition'>
                  All Products
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition'>
                  Categories
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition'>
                  Deals
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className='font-semibold mb-4'>Support</h5>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <a href='#' className='hover:text-white transition'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition'>
                  FAQ
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition'>
                  Shipping
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className='font-semibold mb-4'>Newsletter</h5>
            <p className='text-gray-400 mb-4'>Subscribe for exclusive deals</p>
            <input
              type='email'
              placeholder='Your email'
              className='w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500'
            />
          </div>
        </div>
        <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
          <p>&copy; 2024 ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Main App
const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <Hero />
        <Categories />
        <Products />
        <Footer />
      </div>
    </QueryClientProvider>
  )
}

export default App
