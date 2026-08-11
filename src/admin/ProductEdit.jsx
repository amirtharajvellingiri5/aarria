import React, { useState, useRef, useEffect } from 'react'
import AdminNav from './AdminNav'
import {
  Upload,
  X,
  Plus,
  ChevronDown,
  Image,
  Tag,
  Package,
  Layers,
  DollarSign,
  Check,
  AlertCircle,
  Trash2,
  Eye,
  ArrowLeft,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import { ADMIN_CATEGORIES as categories } from '../utils/categories'
import { CATALOG_URL, INVENTORY_URL } from '../config'
import { useAuthStore } from '../store/authStore'
import { MATERIALS } from '../constants/materials'
import { DESIGNS } from '../constants/designs'
import { BOTTOM_TYPES } from '../constants/bottomTypes'
import { COLOR_MAP, formatColorLabel } from '../constants/colors'
import {
  PATTERNS, SAREE_TYPES, BLOUSE_INCLUDED, BLOUSE_TYPES, BORDER_TYPES,
  NUMBER_OF_BLOUSES, SAREE_LENGTHS, SAREE_WEIGHTS,
} from '../constants/sareeAttributes'
import {
  STITCH_TYPES, PACK_SIZES, WEIGHTS, LENGTH_TYPES, PRODUCT_TYPES,
  TOP_LENGTHS, DUPATTA_SIZES, OCCASIONS, TOP_TYPES, KURTI_TYPES,
} from '../constants/categoryAttributes'
const authHeaders = () => ({ Authorization: `Bearer ${useAuthStore.getState().token || ''}` })

// ── Constants ─────────────────────────────────────────────────────────────────
const COLOR_OPTIONS = Object.keys(COLOR_MAP).map(formatColorLabel)

const uid = () => Math.random().toString(36).slice(2)

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', 'Free Size']
const SLEEVE_LENGTH_OPTIONS = ['Sleeveless','Short Sleeves','Half Sleeves','3/4 Sleeves','Long Sleeves','Cap Sleeves','Bell Sleeves','Puff Sleeves']
const NECK_OPTIONS = ['Round Neck','V-Neck','Boat Neck','Mandarin Collar','Collared Neck','Square Neck','Sweetheart Neck','Keyhole Neck']
const DESIGN_STYLING_OPTIONS = ['Regular', 'Straight', 'A-Line', 'Flared', 'Anarkali', 'Asymmetric', 'Layered', 'Panelled']
const emptySizes = () => ALL_SIZES.map((s) => ({ size: s, quantity: '' }))

// Categories with per-part color captured in Description Attributes (ColorPlate) — hide the flat Color picker
const PER_PART_COLOR_TYPES = ['suit-set-3pc', 'suit-set-top-dupatta', 'suit-set-top-kurti', 'dress-material']
// ponytail: all multi-part categories now capture size once as common (not per shawl/top/bottom/kurti);
// kept as an empty map (rather than deleting the branch) in case a future category needs per-part sizes again
const COMPONENTS_BY_TYPE = {}

// ── Sub-components ────────────────────────────────────────────────────────────
const Select = ({ label, options, value, onChange, required, allowCustom, multiple }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 0)
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!e.target.closest('[data-select-root]')) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const filteredOptions = options.filter(
    (o) => typeof o === 'string' && o.toLowerCase().includes(search.toLowerCase()),
  )

  const trimmedSearch = search.trim()
  const showAddCustom =
    allowCustom &&
    trimmedSearch &&
    !options.some((o) => o.toLowerCase() === trimmedSearch.toLowerCase())

  const isSelected = (o) => (multiple ? (value || []).includes(o) : value === o)

  const selectOption = (o) => {
    if (multiple) {
      const current = value || []
      onChange(current.includes(o) ? current.filter((c) => c !== o) : [...current, o])
    } else {
      onChange(o)
      setOpen(false)
      setSearch('')
    }
  }

  const triggerLabel = multiple
    ? (value || []).length ? value.join(', ') : `Select ${label}`
    : value || `Select ${label}`
  const triggerFilled = multiple ? (value || []).length > 0 : !!value

  return (
    <div className='relative' data-select-root>
      {label && (
        <label className='block text-xs font-semibold uppercase tracking-widest text-rose-400 mb-1'>
          {label} {required && <span className='text-rose-500'>*</span>}
        </label>
      )}
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='w-full flex items-center justify-between px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-sm text-stone-200 hover:border-rose-500 transition-colors'
      >
        <span className={triggerFilled ? 'text-stone-100' : 'text-stone-500'}>
          {triggerLabel}
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className='absolute z-[9999] mt-1 w-full bg-stone-900 border border-stone-700 rounded-xl shadow-2xl overflow-hidden'>
          <div className='p-2 border-b border-stone-800'>
            <input
              ref={searchRef}
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search...'
              className='w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500'
            />
          </div>
          <div className='max-h-60 overflow-y-auto'>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((o) => (
                <button
                  key={o}
                  type='button'
                  onClick={() => selectOption(o)}
                  className='w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:bg-rose-500/10 hover:text-rose-400 transition-colors flex items-center gap-2'
                >
                  {isSelected(o) ? <Check size={12} className='text-rose-400' /> : <span className='w-3' />}
                  {o}
                </button>
              ))
            ) : !showAddCustom ? (
              <div className='px-4 py-3 text-sm text-stone-500'>No results found</div>
            ) : null}
            {showAddCustom && (
              <button
                type='button'
                onClick={() => {
                  onChange(trimmedSearch)
                  setOpen(false)
                  setSearch('')
                }}
                className='w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 border-t border-stone-800'
              >
                <Plus size={12} />
                Add "{trimmedSearch}"
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const LIGHT_HEXES = ['#ffffff', '#f5f0e8', '#fdd835', '#ffc107', '#a5d6a7', '#bbdefb', '#81d4fa', '#f8bbd0', '#bcaaa4']

// ponytail: value stays a comma-joined string so shared ss*Color state keeps working
const ColorPlate = ({ label, value, onChange, required }) => {
  const selectedColors = value ? value.split(',').map((s) => s.trim()).filter(Boolean) : []

  const toggle = (o) => {
    const next = selectedColors.includes(o) ? selectedColors.filter((c) => c !== o) : [...selectedColors, o]
    onChange(next.join(', '))
  }

  return (
    <div>
      {label && (
        <label className='block text-xs font-semibold uppercase tracking-widest text-rose-400 mb-1'>
          {label} {required && <span className='text-rose-500'>*</span>}
        </label>
      )}
      {selectedColors.length > 0 && (
        <div className='flex flex-wrap gap-1.5 mb-2'>
          {selectedColors.map((o) => (
            <span
              key={o}
              className='inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-xs text-stone-300'
            >
              {o}
              <button
                type='button'
                title={`Remove ${o}`}
                onClick={() => toggle(o)}
                className='rounded-full p-0.5 hover:bg-stone-700 text-stone-400 hover:text-stone-200'
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className='flex flex-wrap gap-2'>
        {COLOR_OPTIONS.map((o) => {
          const hex = COLOR_MAP[o.toLowerCase()]
          const selected = selectedColors.includes(o)
          return (
            <button
              key={o}
              type='button'
              title={o}
              onClick={() => toggle(o)}
              className={`w-7 h-7 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                selected ? 'border-rose-500' : 'border-stone-700 hover:border-stone-500'
              }`}
              style={
                hex
                  ? { backgroundColor: hex }
                  : { background: 'repeating-linear-gradient(45deg, #78716c 0 4px, #292524 4px 8px)' }
              }
            >
              {selected && <Check size={12} className={!hex || LIGHT_HEXES.includes(hex) ? 'text-stone-900' : 'text-white'} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const Field = ({ label, required, hint, children }) => (
  <div>
    {label && (
      <label className='block text-xs font-semibold uppercase tracking-widest text-rose-400 mb-1'>
        {label} {required && <span className='text-rose-500'>*</span>}
      </label>
    )}
    {children}
    {hint && <p className='mt-1 text-xs text-stone-500'>{hint}</p>}
  </div>
)

const Input = ({ placeholder, value, onChange, type = 'text', prefix, disabled }) => (
  <div className='relative flex items-center'>
    {prefix && (
      <span className='absolute left-4 text-stone-400 text-sm font-medium pointer-events-none'>{prefix}</span>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${prefix ? 'pl-8' : ''}`}
    />
  </div>
)

const Textarea = ({ placeholder, value, onChange, rows = 4 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className='w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-colors resize-y'
  />
)

const Section = ({ icon: Icon, title, subtitle, children }) => (
  <div className='bg-stone-950 border border-stone-800 rounded-2xl overflow-visible'>
    <div className='flex items-center gap-3 px-6 py-4 border-b border-stone-800 bg-stone-900/50'>
      <div className='w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center'>
        <Icon size={16} className='text-rose-400' />
      </div>
      <div>
        <h3 className='text-sm font-bold text-stone-100'>{title}</h3>
        {subtitle && <p className='text-xs text-stone-500'>{subtitle}</p>}
      </div>
    </div>
    <div className='p-6 space-y-5'>{children}</div>
  </div>
)

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Map an API product response back to local component state.
 * Adjust field paths to match your actual API shape.
 */
const mapApiToState = (product) => {
  const categorySlug = categories.find((c) => c.category_id === product.category?.category_id)?.slug

  const variants = (product.inventory?.variants || []).map((v) => ({
    id: uid(),
    colors: (v.color || 'Red').split(',').map((c) => c.trim()).filter(Boolean),
    sizes: ALL_SIZES.map((s) => {
      // sizes may be a flat array (standard/saree) or a per-component object (legacy multi-part)
      const list = Array.isArray(v.sizes) ? v.sizes : []
      const found = list.find((sz) => sz.size === s)
      return { size: s, quantity: found ? String(found.quantity) : '' }
    }),
    componentSizes: { shawl: emptySizes(), top: emptySizes(), bottom: emptySizes(), kurti: emptySizes() },
    // Existing server images shown as preview URLs
    main_image_preview: v.main_image
      ? { id: uid(), src: `https://cdn.vaarria.com/app/images/${v.main_image}`, name: v.main_image }
      : null,
    other_image_previews: (v.other_images || []).map((key) => ({
      id: uid(),
      src: `https://cdn.vaarria.com/app/images/${key}`,
      name: key,
    })),
    // Keep server filenames so unchanged images don't get re-uploaded
    main_image_filename: v.main_image || '',
    other_image_filenames: (v.other_images || []).map((key) => ({ id: uid(), filename: key })),
    // Files are null — only set when the user picks a NEW file
    main_image_file: null,
    other_image_files: [],
    product_id: product.product_id,
  }))

  const desc = product.description?.description || product.description || {}

  return {
    title: product.title || '',
    brandName: product.brand?.name || '',
    catalogueId: product.brand?.catalogue_id || '',
    categoryId: product.category?.category_id || 5,
    // Shared / default
    material: desc.Material || '',
    sleeveLength: desc['Sleeve Length'] || '',
    neck: desc.Neck || desc['Neck Design'] || '',
    designStyling: desc['Design Styling'] || '',
    design: desc.Design || '',
    bottomType: desc['Bottom Type'] || '',
    topLength: desc['Top Length'] || '',
    occasion: desc.Occasion || '',
    // Saree
    sareeColor: desc.Color || '',
    pattern: desc.Pattern || '',
    sareeType: desc['Saree Type'] || '',
    blouseIncluded: desc['Blouse Included'] || '',
    numberOfBlouses: desc['Number of Blouses'] || '',
    blouseType: desc['Blouse Type'] || '',
    blouseDesign: desc['Blouse Design'] || '',
    sareeLength: desc['Saree Length'] || '',
    blouseMaterial: desc['Blouse Material'] || '',
    sareeWeight: desc['Saree Weight'] || '',
    sareeBorder: desc['Saree Border'] || '',
    blouseColor: desc['Blouse Color'] || '',
    blousePattern: desc['Blouse Pattern'] || '',
    blouseBorder: desc['Blouse Border'] || '',
    blouseSize: desc['Blouse Size'] || '',
    // Dress material
    dmTopColor: desc['Top Color'] || desc['Top Colour'] || '',
    dmTopMaterial: desc['Top Material'] || '',
    dmTopPattern: desc['Top Pattern'] || '',
    dmTopDesign: desc['Top Design'] || '',
    dmTopSize: desc['Top Size'] || '',
    dmBottomColor: desc['Bottom Color'] || desc['Bottom Colour'] || '',
    dmBottomMaterial: desc['Bottom Material'] || '',
    dmBottomPattern: desc['Bottom Pattern'] || '',
    dmBottomDesign: desc['Bottom Design'] || '',
    dmBottomSize: desc['Bottom Size'] || '',
    dmShawlColor: desc['Shawl Color'] || desc['Shawl Colour'] || '',
    dmShawlMaterial: desc['Shawl Material'] || '',
    dmShawlPattern: desc['Shawl Pattern'] || '',
    dmShawlDesign: desc['Shawl Design'] || '',
    dmShawlSize: desc['Shawl Size'] || '',
    dmStitchType: desc['Stitch Type'] || '',
    dmWeight: desc.Weight || '',
    dmDupattaSize: desc['Dupatta Size'] || '',
    dmPackSize: desc['Pack Of'] || desc['Pack Size'] || '',
    // Leggings
    legLength: desc.Length || '',
    legColour: desc.Color || '',
    legWeight: desc.Weight || '',
    // Dupattas/Shawls
    shawlColor: desc.Color || desc.Colour || '',
    shawlSize: desc.Size || '',
    shawlWeight: desc.Weight || '',
    // Dresses
    dressColour: desc.Color || desc.Colour || '',
    dressWeight: desc.Weight || '',
    // Tunics
    tunicColour: desc.Color || desc.Colour || '',
    tunicWeight: desc.Weight || '',
    tunicTopType: desc['Top Type'] || '',
    // Straight pants
    pantsColour: desc.Color || desc.Colour || '',
    pantsWeight: desc.Weight || '',
    // Suit sets
    ssTopMaterial: desc['Top Material'] || '',
    ssTopPattern: desc['Top Pattern'] || '',
    ssTopDesign: desc['Top Design'] || '',
    ssTopColor: desc['Top Color'] || desc['Top Colour'] || '',
    ssBottomMaterial: desc['Bottom Material'] || '',
    ssBottomPattern: desc['Bottom Pattern'] || '',
    ssBottomColor: desc['Bottom Color'] || desc['Bottom Colour'] || '',
    ssShawlMaterial: desc['Shawl Material'] || '',
    ssShawlPattern: desc['Shawl Pattern'] || '',
    ssShawlDesign: desc['Shawl Design'] || '',
    ssShawlColor: desc['Shawl Color'] || desc['Shawl Colour'] || '',
    ssKurtiMaterial: desc['Kurti Material'] || '',
    ssKurtiPattern: desc['Kurti Pattern'] || '',
    ssKurtiDesign: desc['Kurti Design'] || '',
    ssKurtiColor: desc['Kurti Color'] || desc['Kurti Colour'] || '',
    ssKurtiType: desc['Kurti Type'] || '',
    ssProductType: desc['Product Type'] || '',
    ssWeight: desc.Weight || '',
    ssDupattaSize: desc['Dupatta Size'] || '',
    ssPackSize: desc['Pack Of'] || desc['Pack Size'] || '',
    description: desc.product_blurb || '',
    highlights: desc.highlights || '',
    videoUrl1: desc['Video URL 1'] || '',
    videoUrl2: desc['Video URL 2'] || '',
    isFeatured: !!product.is_featured,
    mrp: String(product.pricing?.mrp || ''),
    salePrice: String(product.pricing?.sale_price || ''),
    buyPrice: String(product.pricing?.buy_price || ''),
    gst: String(product.pricing?.gst || ''),
    discountType: product.pricing?.discounts?.discount_type || 'FLAT',
    discountValue: String(product.pricing?.discounts?.value || ''),
    variants: variants.length > 0 ? variants : [emptyVariant()],
    product_id: product.product_id,
  }
}

const emptyVariant = () => ({
  id: uid(),
  colors: ['Red'],
  sizes: ALL_SIZES.map((s) => ({ size: s, quantity: '' })),
  componentSizes: { shawl: emptySizes(), top: emptySizes(), bottom: emptySizes(), kurti: emptySizes() },
  main_image_preview: null,
  other_image_previews: [],
  main_image_filename: '',
  other_image_filenames: [],
  main_image_file: null,
  other_image_files: [],
})

// ── Main Component ────────────────────────────────────────────────────────────
/**
 * Props:
 *   productId  – string/number, the ID of the product to edit
 *   onBack     – optional callback for the ← button
 */
const ProductEdit = ({ onBack }) => {
  // ── Fetch state
  const { id: productId } = useParams()   // get from URL
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [originalRatings, setOriginalRatings] = useState({ average_rating: 0, review_count: 0 })

  // ── Form state
  const [title, setTitle] = useState('')
  const [brandName, setBrandName] = useState('')
  const [catalogueId, setCatalogueId] = useState('')
  const [categoryId, setCategoryId] = useState(5)
  const [material, setMaterial] = useState('')
  const [sleeveLength, setSleeveLength] = useState('')
  const [neck, setNeck] = useState('')
  const [designStyling, setDesignStyling] = useState('')
  const [design, setDesign] = useState('')
  const [bottomType, setBottomType] = useState('')
  const [description, setDescription] = useState('')
  const [highlights, setHighlights] = useState('')
  const [mrp, setMrp] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [gst, setGst] = useState('')
  const [discountType, setDiscountType] = useState('FLAT')
  const [discountValue, setDiscountValue] = useState('')
  const [variants, setVariants] = useState([emptyVariant()])
  const [isFeatured, setIsFeatured] = useState(false)
  const [videoUrl1, setVideoUrl1] = useState('')
  const [videoUrl2, setVideoUrl2] = useState('')

  // ── Category flags ─────────────────────────────────────────────────────────
  const categorySlug = categories.find((c) => c.category_id === categoryId)?.slug
  const isSaree = categorySlug === 'sarees'
  const isDressMaterial = categorySlug === 'dress-materials'
  const isLegging = categorySlug === 'leggings'
  const isKurtisTops = categorySlug === 'kurtis-tops'
  const isShawlCategory = categorySlug === 'dupattas-shawls'
  const isSuitSet3pc = categorySlug === 'suit-set-3pc'
  const isSuitSetTopDupatta = categorySlug === 'suit-set-top-dupatta'
  const isSuitSetTopKurti = categorySlug === 'suit-set-top-kurti'
  const isDresses = categorySlug === 'dresses'
  const isTunics = categorySlug === 'tunics'
  const isStraightPants = categorySlug === 'straight-pants'
  const categoryType = isSaree
    ? 'saree'
    : isDressMaterial
    ? 'dress-material'
    : isSuitSet3pc
    ? 'suit-set-3pc'
    : isSuitSetTopDupatta
    ? 'suit-set-top-dupatta'
    : isSuitSetTopKurti
    ? 'suit-set-top-kurti'
    : 'standard'

  // ── Per-category attribute state ──────────────────────────────────────────
  // Saree
  const [sareeColor, setSareeColor] = useState('')
  const [pattern, setPattern] = useState('')
  const [sareeType, setSareeType] = useState('')
  const [blouseIncluded, setBlouseIncluded] = useState('')
  const [numberOfBlouses, setNumberOfBlouses] = useState('')
  const [blouseType, setBlouseType] = useState('')
  const [blouseDesign, setBlouseDesign] = useState('')
  const [sareeLength, setSareeLength] = useState('')
  const [blouseMaterial, setBlouseMaterial] = useState('')
  const [sareeWeight, setSareeWeight] = useState('')
  const [sareeBorder, setSareeBorder] = useState('')
  const [blouseColor, setBlouseColor] = useState('')
  const [blousePattern, setBlousePattern] = useState('')
  const [blouseBorder, setBlouseBorder] = useState('')
  const [blouseSize, setBlouseSize] = useState('')
  // Dress material
  const [dmShawlColor, setDmShawlColor] = useState('')
  const [dmShawlMaterial, setDmShawlMaterial] = useState('')
  const [dmShawlPattern, setDmShawlPattern] = useState('')
  const [dmShawlDesign, setDmShawlDesign] = useState('')
  const [dmShawlSize, setDmShawlSize] = useState('')
  const [dmTopColor, setDmTopColor] = useState('')
  const [dmTopMaterial, setDmTopMaterial] = useState('')
  const [dmTopPattern, setDmTopPattern] = useState('')
  const [dmTopDesign, setDmTopDesign] = useState('')
  const [dmTopSize, setDmTopSize] = useState('')
  const [dmBottomColor, setDmBottomColor] = useState('')
  const [dmBottomMaterial, setDmBottomMaterial] = useState('')
  const [dmBottomPattern, setDmBottomPattern] = useState('')
  const [dmBottomDesign, setDmBottomDesign] = useState('')
  const [dmBottomSize, setDmBottomSize] = useState('')
  const [dmStitchType, setDmStitchType] = useState('')
  const [dmWeight, setDmWeight] = useState('')
  const [dmDupattaSize, setDmDupattaSize] = useState('')
  const [dmPackSize, setDmPackSize] = useState('')
  // Leggings
  const [legLength, setLegLength] = useState('')
  const [legColour, setLegColour] = useState('')
  const [legWeight, setLegWeight] = useState('')
  // Dupattas/Shawls
  const [shawlColor, setShawlColor] = useState('')
  const [shawlSize, setShawlSize] = useState('')
  const [shawlWeight, setShawlWeight] = useState('')
  // Dresses
  const [dressColour, setDressColour] = useState('')
  const [dressWeight, setDressWeight] = useState('')
  // Tunics
  const [tunicColour, setTunicColour] = useState('')
  const [tunicWeight, setTunicWeight] = useState('')
  const [tunicTopType, setTunicTopType] = useState('')
  // Straight pants
  const [pantsColour, setPantsColour] = useState('')
  const [pantsWeight, setPantsWeight] = useState('')
  // Suit sets (shared across 3pc / top-dupatta / top-kurti)
  const [ssTopMaterial, setSsTopMaterial] = useState('')
  const [ssTopPattern, setSsTopPattern] = useState('')
  const [ssTopDesign, setSsTopDesign] = useState('')
  const [ssTopColor, setSsTopColor] = useState('')
  const [ssBottomMaterial, setSsBottomMaterial] = useState('')
  const [ssBottomPattern, setSsBottomPattern] = useState('')
  const [ssBottomColor, setSsBottomColor] = useState('')
  const [ssShawlMaterial, setSsShawlMaterial] = useState('')
  const [ssShawlPattern, setSsShawlPattern] = useState('')
  const [ssShawlDesign, setSsShawlDesign] = useState('')
  const [ssShawlColor, setSsShawlColor] = useState('')
  const [ssKurtiMaterial, setSsKurtiMaterial] = useState('')
  const [ssKurtiPattern, setSsKurtiPattern] = useState('')
  const [ssKurtiDesign, setSsKurtiDesign] = useState('')
  const [ssKurtiColor, setSsKurtiColor] = useState('')
  const [ssKurtiType, setSsKurtiType] = useState('')
  const [ssProductType, setSsProductType] = useState('')
  const [ssWeight, setSsWeight] = useState('')
  const [ssDupattaSize, setSsDupattaSize] = useState('')
  const [ssPackSize, setSsPackSize] = useState('')
  // Shared
  const [occasion, setOccasion] = useState('')
  const [topLength, setTopLength] = useState('')

  // ── UI state
  const [status, setStatus] = useState('Draft')
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('edit')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // ── Load product on mount ──────────────────────────────────────────────────
  const fetchProduct = async () => {
    setLoading(true)
    setFetchError('')
    try {
      const res = await fetch(
        `${CATALOG_URL}/product/${productId}`,
      )
      if (!res.ok) throw new Error(`Failed to fetch product (${res.status})`)
      const data = await res.json()

      const mapped = mapApiToState(data)
      setTitle(mapped.title)
      setBrandName(mapped.brandName)
      setCatalogueId(mapped.catalogueId)
      setCategoryId(mapped.categoryId)
      setMaterial(mapped.material)
      setSleeveLength(mapped.sleeveLength)
      setNeck(mapped.neck)
      setDesignStyling(mapped.designStyling)
      setDesign(mapped.design)
      setBottomType(mapped.bottomType)
      setTopLength(mapped.topLength)
      setOccasion(mapped.occasion)
      // Saree
      setSareeColor(mapped.sareeColor)
      setPattern(mapped.pattern)
      setSareeType(mapped.sareeType)
      setBlouseIncluded(mapped.blouseIncluded)
      setNumberOfBlouses(mapped.numberOfBlouses)
      setBlouseType(mapped.blouseType)
      setBlouseDesign(mapped.blouseDesign)
      setSareeLength(mapped.sareeLength)
      setBlouseMaterial(mapped.blouseMaterial)
      setSareeWeight(mapped.sareeWeight)
      setSareeBorder(mapped.sareeBorder)
      setBlouseColor(mapped.blouseColor)
      setBlousePattern(mapped.blousePattern)
      setBlouseBorder(mapped.blouseBorder)
      setBlouseSize(mapped.blouseSize)
      // Dress material
      setDmTopColor(mapped.dmTopColor)
      setDmTopMaterial(mapped.dmTopMaterial)
      setDmTopPattern(mapped.dmTopPattern)
      setDmTopDesign(mapped.dmTopDesign)
      setDmTopSize(mapped.dmTopSize)
      setDmBottomColor(mapped.dmBottomColor)
      setDmBottomMaterial(mapped.dmBottomMaterial)
      setDmBottomPattern(mapped.dmBottomPattern)
      setDmBottomDesign(mapped.dmBottomDesign)
      setDmBottomSize(mapped.dmBottomSize)
      setDmShawlColor(mapped.dmShawlColor)
      setDmShawlMaterial(mapped.dmShawlMaterial)
      setDmShawlPattern(mapped.dmShawlPattern)
      setDmShawlDesign(mapped.dmShawlDesign)
      setDmShawlSize(mapped.dmShawlSize)
      setDmStitchType(mapped.dmStitchType)
      setDmWeight(mapped.dmWeight)
      setDmDupattaSize(mapped.dmDupattaSize)
      setDmPackSize(mapped.dmPackSize)
      // Leggings
      setLegLength(mapped.legLength)
      setLegColour(mapped.legColour)
      setLegWeight(mapped.legWeight)
      // Dupattas/Shawls
      setShawlColor(mapped.shawlColor)
      setShawlSize(mapped.shawlSize)
      setShawlWeight(mapped.shawlWeight)
      // Dresses
      setDressColour(mapped.dressColour)
      setDressWeight(mapped.dressWeight)
      // Tunics
      setTunicColour(mapped.tunicColour)
      setTunicWeight(mapped.tunicWeight)
      setTunicTopType(mapped.tunicTopType)
      // Straight pants
      setPantsColour(mapped.pantsColour)
      setPantsWeight(mapped.pantsWeight)
      // Suit sets
      setSsTopMaterial(mapped.ssTopMaterial)
      setSsTopPattern(mapped.ssTopPattern)
      setSsTopDesign(mapped.ssTopDesign)
      setSsTopColor(mapped.ssTopColor)
      setSsBottomMaterial(mapped.ssBottomMaterial)
      setSsBottomPattern(mapped.ssBottomPattern)
      setSsBottomColor(mapped.ssBottomColor)
      setSsShawlMaterial(mapped.ssShawlMaterial)
      setSsShawlPattern(mapped.ssShawlPattern)
      setSsShawlDesign(mapped.ssShawlDesign)
      setSsShawlColor(mapped.ssShawlColor)
      setSsKurtiMaterial(mapped.ssKurtiMaterial)
      setSsKurtiPattern(mapped.ssKurtiPattern)
      setSsKurtiDesign(mapped.ssKurtiDesign)
      setSsKurtiColor(mapped.ssKurtiColor)
      setSsKurtiType(mapped.ssKurtiType)
      setSsProductType(mapped.ssProductType)
      setSsWeight(mapped.ssWeight)
      setSsDupattaSize(mapped.ssDupattaSize)
      setSsPackSize(mapped.ssPackSize)
      setDescription(mapped.description)
      setHighlights(mapped.highlights)
      setVideoUrl1(mapped.videoUrl1)
      setVideoUrl2(mapped.videoUrl2)
      setIsFeatured(mapped.isFeatured)
      setMrp(mapped.mrp)
      setSalePrice(mapped.salePrice)
      setBuyPrice(mapped.buyPrice)
      setGst(mapped.gst)
      setDiscountType(mapped.discountType)
      setDiscountValue(mapped.discountValue)
      setVariants(mapped.variants)

      // Preserve ratings from API so we don't overwrite them
      setOriginalRatings({
        average_rating: data.ratings?.average_rating ?? 0,
        review_count: data.ratings?.review_count ?? 0,
      })

      setStatus(data.status || 'Draft')
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) fetchProduct()
    else setLoading(false) // no productId: start empty (shouldn't happen in edit mode)
  }, [productId])

  // ── Discount calc ──────────────────────────────────────────────────────────
  const calculateFinalPrice = () => {
    const base = parseFloat(salePrice) || 0
    const d = parseFloat(discountValue) || 0
    if (!base) return { finalPrice: 0, discountAmount: 0, percent: 0 }
    let discountAmount = 0, percent = 0
    if (discountType === 'PERCENTAGE') {
      percent = Math.round(d)
      discountAmount = parseFloat(((base * d) / 100).toFixed(2))
    } else {
      discountAmount = Math.min(d, base)
      percent = base > 0 ? Math.round((discountAmount / base) * 100) : 0
    }
    return { finalPrice: parseFloat((base - discountAmount).toFixed(2)), discountAmount, percent }
  }
  const discountData = calculateFinalPrice()

  // ── Variant helpers ────────────────────────────────────────────────────────
  const setVariantField = (variantId, field, val) =>
    setVariants((prev) => prev.map((v) => v.id === variantId ? { ...v, [field]: val } : v))

  const setVariantSize = (variantId, size, qty) =>
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, sizes: v.sizes.map((s) => s.size === size ? { ...s, quantity: qty } : s) }
          : v,
      ),
    )

  const setVariantComponentSize = (variantId, component, size, qty) =>
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
              ...v,
              componentSizes: {
                ...v.componentSizes,
                [component]: v.componentSizes[component].map((s) => s.size === size ? { ...s, quantity: qty } : s),
              },
            }
          : v,
      ),
    )

  // ── Image helpers ──────────────────────────────────────────────────────────
  const readImage = (file) =>
    new Promise((res) => { const r = new FileReader(); r.onload = (e) => res(e.target.result); r.readAsDataURL(file) })

  const handleMainImage = async (variantId, e) => {
    const file = e.target.files[0]
    if (!file) return
    const src = await readImage(file)
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, main_image_preview: { id: uid(), src, name: file.name }, main_image_file: file, main_image_filename: '' }
          : v,
      ),
    )
  }

  const removeMainImage = (variantId) =>
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, main_image_preview: null, main_image_filename: '', main_image_file: null }
          : v,
      ),
    )

  const handleOtherImages = async (variantId, e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const newEntries = await Promise.all(
      files.map(async (f) => { const src = await readImage(f); return { id: uid(), src, name: f.name, file: f } }),
    )
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v
        return {
          ...v,
          other_image_previews: [...v.other_image_previews, ...newEntries.map(({ id, src, name }) => ({ id, src, name }))],
          other_image_files: [...(v.other_image_files || []), ...newEntries.map(({ id, file }) => ({ id, file }))],
          other_image_filenames: [...v.other_image_filenames, ...newEntries.map(({ id }) => ({ id, filename: '' }))],
        }
      }),
    )
  }

  const removeOtherImage = (variantId, imgId) =>
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
              ...v,
              other_image_previews: v.other_image_previews.filter((i) => i.id !== imgId),
              other_image_filenames: v.other_image_filenames.filter((i) => i.id !== imgId),
              other_image_files: (v.other_image_files || []).filter((i) => i.id !== imgId),
            }
          : v,
      ),
    )

  // ── Upload only NEW images (existing ones already have filenames) ──────────
  const uploadNewImages = async () => {
    const formData = new FormData()
    let hasFiles = false

    variants.forEach((v) => {
      if (v.main_image_file) { formData.append('images', v.main_image_file); hasFiles = true }
      v.other_image_files?.forEach((f) => { formData.append('images', f.file); hasFiles = true })
    })

    if (!hasFiles) return [] // nothing to upload

    const res = await fetch('https://aarria-image-upload.chatoyantvortex.workers.dev/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(JSON.stringify(data))
    return data.uploaded
  }

  // ── Build inventory variants (category-aware color & sizing) ───────────────
  const buildInventoryVariants = (list) => list.map((v) => {
    let color
    if (categoryType === 'suit-set-3pc') color = [ssTopColor, ssBottomColor, ssShawlColor].filter(Boolean).join(', ')
    else if (categoryType === 'dress-material') color = [dmTopColor, dmBottomColor, dmShawlColor].filter(Boolean).join(', ')
    else if (categoryType === 'suit-set-top-dupatta') color = [ssTopColor, ssShawlColor].filter(Boolean).join(', ')
    else if (categoryType === 'suit-set-top-kurti') color = [ssTopColor, ssKurtiColor].filter(Boolean).join(', ')
    else color = v.colors.join(', ')

    const base = {
      color,
      main_image: v.main_image_filename,
      other_images: v.other_image_filenames.filter((f) => f.filename).map((f) => f.filename),
    }

    if (COMPONENTS_BY_TYPE[categoryType]) {
      const sizes = {}
      COMPONENTS_BY_TYPE[categoryType].forEach((component) => {
        sizes[component] = v.componentSizes[component].filter((s) => s.quantity !== '').map((s) => ({ size: s.size, quantity: parseInt(s.quantity) || 0 }))
      })
      return { ...base, sizes }
    }

    if (isSaree) {
      const qty = v.sizes.find((s) => s.size === 'Free Size')?.quantity
      return { ...base, sizes: qty !== '' && qty != null ? [{ size: 'Free Size', quantity: parseInt(qty) || 0 }] : [] }
    }

    return { ...base, sizes: v.sizes.filter((s) => s.quantity !== '').map((s) => ({ size: s.size, quantity: parseInt(s.quantity) || 0 })) }
  })

  // ── Build payload ──────────────────────────────────────────────────────────
  const buildPayload = (updatedVariants) => {
    const fabric = isDressMaterial
      ? (dmTopMaterial || dmBottomMaterial || dmShawlMaterial || '')
      : isSuitSet3pc
      ? (ssTopMaterial || ssBottomMaterial || ssShawlMaterial || '')
      : isSuitSetTopDupatta
      ? (ssTopMaterial || ssShawlMaterial || '')
      : isSuitSetTopKurti
      ? (ssTopMaterial || ssKurtiMaterial || '')
      : material

    let desc
    if (isSaree) {
      desc = {
        Material: material, Color: sareeColor, Design: design, Pattern: pattern,
        'Saree Type': sareeType, 'Blouse Included': blouseIncluded, 'Number of Blouses': numberOfBlouses,
        'Blouse Type': blouseType, 'Blouse Design': blouseDesign, 'Saree Length': sareeLength,
        'Blouse Material': blouseMaterial, 'Saree Weight': sareeWeight, 'Saree Border': sareeBorder,
        'Blouse Color': blouseColor, 'Blouse Pattern': blousePattern, 'Blouse Border': blouseBorder,
        'Blouse Size': blouseSize,
      }
    } else if (isDressMaterial) {
      desc = {
        'Top Color': dmTopColor, 'Top Material': dmTopMaterial, 'Top Pattern': dmTopPattern, 'Top Design': dmTopDesign, 'Top Size': dmTopSize,
        'Bottom Color': dmBottomColor, 'Bottom Material': dmBottomMaterial, 'Bottom Pattern': dmBottomPattern, 'Bottom Design': dmBottomDesign, 'Bottom Size': dmBottomSize,
        'Shawl Color': dmShawlColor, 'Shawl Material': dmShawlMaterial, 'Shawl Pattern': dmShawlPattern, 'Shawl Design': dmShawlDesign, 'Shawl Size': dmShawlSize,
        'Stitch Type': dmStitchType, Weight: dmWeight, 'Dupatta Size': dmDupattaSize, 'Pack Size': dmPackSize,
      }
    } else if (isLegging) {
      desc = { Material: material, Length: legLength, Color: legColour, Design: design, Weight: legWeight }
    } else if (isKurtisTops) {
      desc = { Material: material, 'Sleeve Length': sleeveLength, Neck: neck, 'Design Styling': designStyling, Design: design, 'Top Length': topLength }
    } else if (isShawlCategory) {
      desc = { Material: material, Color: shawlColor, Design: design, Pattern: pattern, Size: shawlSize, Weight: shawlWeight }
    } else if (isSuitSet3pc) {
      desc = {
        'Top Material': ssTopMaterial, 'Top Pattern': ssTopPattern, 'Top Design': ssTopDesign, 'Top Color': ssTopColor,
        'Bottom Material': ssBottomMaterial, 'Bottom Pattern': ssBottomPattern, 'Bottom Color': ssBottomColor,
        'Shawl Material': ssShawlMaterial, 'Shawl Pattern': ssShawlPattern, 'Shawl Design': ssShawlDesign, 'Shawl Color': ssShawlColor,
        'Product Type': ssProductType, Weight: ssWeight, 'Dupatta Size': ssDupattaSize, 'Pack Size': ssPackSize, 'Top Length': topLength,
      }
    } else if (isSuitSetTopDupatta) {
      desc = {
        'Top Material': ssTopMaterial, 'Top Pattern': ssTopPattern, 'Top Design': ssTopDesign, 'Top Color': ssTopColor,
        'Shawl Material': ssShawlMaterial, 'Shawl Pattern': ssShawlPattern, 'Shawl Design': ssShawlDesign, 'Shawl Color': ssShawlColor,
        'Product Type': ssProductType, Weight: ssWeight, 'Dupatta Size': ssDupattaSize, 'Pack Size': ssPackSize, 'Top Length': topLength,
      }
    } else if (isSuitSetTopKurti) {
      desc = {
        'Top Material': ssTopMaterial, 'Top Pattern': ssTopPattern, 'Top Design': ssTopDesign, 'Top Color': ssTopColor,
        'Kurti Material': ssKurtiMaterial, 'Kurti Pattern': ssKurtiPattern, 'Kurti Design': ssKurtiDesign, 'Kurti Color': ssKurtiColor, 'Kurti Type': ssKurtiType,
        'Product Type': ssProductType, Weight: ssWeight, 'Pack Size': ssPackSize, 'Top Length': topLength,
      }
    } else if (isDresses) {
      desc = { Material: material, Color: dressColour, Design: design, 'Design Styling': designStyling, Weight: dressWeight, 'Top Length': topLength }
    } else if (isTunics) {
      desc = { Material: material, Color: tunicColour, Design: design, 'Sleeve Length': sleeveLength, Neck: neck, 'Top Type': tunicTopType, Weight: tunicWeight }
    } else if (isStraightPants) {
      desc = { Material: material, Color: pantsColour, Design: design, 'Bottom Type': bottomType, Weight: pantsWeight }
    } else {
      desc = {
        Material: material,
        'Sleeve Length': sleeveLength,
        Neck: neck,
        'Design Styling': designStyling,
        Design: design,
        'Bottom Type': bottomType,
      }
    }

    desc = {
      ...desc,
      Occasion: occasion,
      product_blurb: description,
      highlights: highlights,
      ...(videoUrl1.trim() ? { 'Video URL 1': videoUrl1.trim() } : {}),
      ...(videoUrl2.trim() ? { 'Video URL 2': videoUrl2.trim() } : {}),
    }

    return {
      product_id: productId,
      title,
      fabric,
      brand: { name: brandName, catalogue_id: catalogueId },
      category: {
        category_name: categories.find((c) => c.category_id === categoryId)?.name,
        category_id: categoryId,
      },
      description: desc,
      pricing: {
        mrp: parseFloat(mrp) || 0,
        sale_price: parseFloat(salePrice) || 0,
        buy_price: parseFloat(buyPrice) || 0,
        gst: parseFloat(gst) || 0,
        discounts: { discount_type: discountType, value: parseFloat(discountValue) || 0 },
      },
      inventory: { variants: buildInventoryVariants(updatedVariants) },
      ratings: originalRatings, // preserve existing ratings
      is_featured: isFeatured,
    }
  }

  // ── Update (PUT) ───────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      // 1. Upload only new images
      const uploaded = await uploadNewImages()
      let uploadIndex = 0

      const updatedVariants = variants.map((v) => {
        let mainKey = v.main_image_filename // default: keep existing
        let otherFilenames = [...v.other_image_filenames]

        // If user picked a new main image, consume next upload slot
        if (v.main_image_file) {
          mainKey = uploaded[uploadIndex++]?.key || ''
        }

        // For new other images (those with empty filename), consume upload slots
        const resolvedOtherFilenames = otherFilenames.map((f) => {
          if (f.filename === '') {
            // This is a newly added image — find its upload result
            const key = uploaded[uploadIndex++]?.key || ''
            return { ...f, filename: key }
          }
          return f
        })

        return { ...v, main_image_filename: mainKey, other_image_filenames: resolvedOtherFilenames }
      })

      setVariants(updatedVariants)

      // 2. PUT to update API
      const res = await fetch(
        `${INVENTORY_URL}/products/${productId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify(buildPayload(updatedVariants)),
        },
      )
      if (!res.ok) throw new Error(await res.text())

      setStatus('Published')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setSubmitError(err.message)
      alert(`Update failed:\n${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    setStatus('Draft')
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()])
  const removeVariant = (id) => setVariants((prev) => prev.filter((v) => v.id !== id))

  // ── Checklist ──────────────────────────────────────────────────────────────
  const checks = [
    { label: 'Title filled', done: title.length > 2 },
    { label: 'Brand name set', done: brandName.length > 0 },
    { label: 'Category selected', done: !!categoryId },
    { label: 'MRP set', done: !!mrp },
    { label: 'Sale price set', done: !!salePrice },
    { label: 'At least one variant', done: variants.length > 0 && variants[0].colors?.length > 0 },
    { label: 'Main image present', done: variants.some((v) => v.main_image_filename !== '' || v.main_image_file !== null) },
  ]
  const completeness = Math.round((checks.filter((c) => c.done).length / checks.length) * 100)

  const firstVariant = variants[0]

  // ── Preview ────────────────────────────────────────────────────────────────
  const Preview = () => (
    <div className='bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden'>
      <div className='flex items-center gap-3 px-6 py-4 border-b border-stone-800 bg-stone-900/50'>
        <div className='w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center'>
          <Eye size={16} className='text-rose-400' />
        </div>
        <div>
          <h3 className='text-sm font-bold text-stone-100'>Live Preview</h3>
          <p className='text-xs text-stone-500'>How it'll appear on the store</p>
        </div>
      </div>
      <div className='p-6'>
        <div className='bg-white rounded-xl overflow-hidden shadow-2xl max-w-sm mx-auto'>
          <div className='aspect-[3/4] bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center relative'>
            {firstVariant?.main_image_preview ? (
              <img src={firstVariant.main_image_preview.src} alt='preview' className='w-full h-full object-cover' />
            ) : (
              <div className='text-center text-stone-400'>
                <Image size={48} className='mx-auto mb-2 opacity-30' />
                <p className='text-xs'>No image</p>
              </div>
            )}
            {discountData.percent > 0 && (
              <div className='absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                -{discountData.percent}%
              </div>
            )}
          </div>
          <div className='p-4'>
            {categoryId && (
              <span className='text-xs text-rose-500 font-semibold uppercase tracking-wider'>
                {categories.find((c) => c.category_id === categoryId)?.name}
              </span>
            )}
            <h4 className='font-bold text-gray-800 mt-1 text-base leading-tight'>{title || 'Product Title'}</h4>
            {brandName && <p className='text-xs text-gray-400 mt-0.5'>by {brandName}</p>}
            <div className='flex items-center gap-2 mt-3'>
              {salePrice && <span className='text-xl font-bold text-rose-600'>₹{discountData.finalPrice.toLocaleString()}</span>}
              {mrp && salePrice && parseFloat(mrp) !== parseFloat(salePrice) && (
                <span className='text-sm text-gray-400 line-through'>₹{parseFloat(mrp).toLocaleString()}</span>
              )}
            </div>
            {firstVariant?.colors?.length > 0 && (
              <p className='text-xs text-gray-400 mt-2'>
                {firstVariant.colors.length > 1 ? 'Colors' : 'Color'}: {firstVariant.colors.join(', ')}
              </p>
            )}
            {firstVariant?.sizes?.some((s) => s.quantity !== '') && (
              <div className='flex gap-1 mt-3 flex-wrap'>
                {firstVariant.sizes.filter((s) => s.quantity !== '').map((s) => (
                  <span key={s.size} className='text-xs border border-pink-200 text-pink-600 px-2 py-0.5 rounded-full'>{s.size}</span>
                ))}
              </div>
            )}
            <button className='w-full mt-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-semibold'>
              Add to Bag
            </button>
          </div>
        </div>
        {firstVariant?.other_image_previews?.length > 0 && (
          <div className='mt-4'>
            <p className='text-xs text-stone-500 mb-2 uppercase tracking-widest'>Gallery</p>
            <div className='flex gap-2 flex-wrap'>
              {firstVariant.other_image_previews.map((t) => (
                <div key={t.id} className='w-14 h-14 rounded-lg overflow-hidden border border-stone-700'>
                  <img src={t.src} alt='' className='w-full h-full object-cover' />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className='min-h-screen bg-stone-950 flex items-center justify-center' style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <link href='https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap' rel='stylesheet' />
        <div className='flex flex-col items-center gap-4 text-stone-400'>
          <Loader2 size={32} className='animate-spin text-rose-400' />
          <p className='text-sm'>Loading product…</p>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className='min-h-screen bg-stone-950 flex items-center justify-center' style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <link href='https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap' rel='stylesheet' />
        <div className='flex flex-col items-center gap-4 text-center px-6'>
          <AlertCircle size={32} className='text-rose-400' />
          <p className='text-stone-300 font-medium'>Failed to load product</p>
          <p className='text-stone-500 text-sm max-w-xs'>{fetchError}</p>
          <button
            onClick={fetchProduct}
            className='flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition'
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    )
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className='min-h-screen bg-stone-950 text-stone-100' style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href='https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap' rel='stylesheet' />

      <AdminNav />

      {/* Page action bar */}
      <div className='sticky top-16 z-40 bg-stone-950/95 backdrop-blur border-b border-stone-800'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => window.open('/admin', '_blank')}
              className='p-2 rounded-lg hover:bg-stone-800 transition-colors text-stone-400 hover:text-stone-100'
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className='font-bold text-stone-100' style={{ fontFamily: "'Playfair Display', serif", fontSize: 18 }}>
                Edit Product
              </h1>
              <p className='text-xs text-stone-500'>
                {productId ? `ID: ${productId}` : 'Women\'s Ethnic Wear Store'}
              </p>
            </div>
          </div>

          <div className='hidden md:flex items-center bg-stone-900 rounded-xl p-1 border border-stone-800'>
            {['edit', 'preview'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeTab === t ? 'bg-rose-500 text-white shadow' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t === 'preview' ? '👁 Preview' : '✏️ Edit'}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-3'>
            {saved && (
              <div className='flex items-center gap-1.5 text-emerald-400 text-sm font-medium'>
                <Check size={14} /> Saved!
              </div>
            )}
            {submitError && (
              <div className='flex items-center gap-1.5 text-rose-400 text-xs max-w-xs truncate'>
                <AlertCircle size={13} /> {submitError}
              </div>
            )}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              status === 'Published'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {status}
            </span>
            <button
              onClick={handleSaveDraft}
              className='px-4 py-2 rounded-xl text-sm font-semibold border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100 transition-colors'
            >
              Save Draft
            </button>
            <button
              onClick={handleUpdate}
              disabled={submitting}
              className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-60'
            >
              {submitting ? <><Loader2 size={14} className='animate-spin' /> Saving…</> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

          {/* LEFT: edit form */}
          {activeTab === 'edit' && (
            <div className='lg:col-span-2 space-y-6'>
              <Section icon={Package} title='Basic Information' subtitle='Title, brand and catalogue'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='sm:col-span-2'>
                    <Field label='Product Title' required>
                      <Input value={title} onChange={setTitle} placeholder='e.g. Jansya Kurti' />
                    </Field>
                  </div>
                  <Field label='Brand Name' required>
                    <Input value={brandName} onChange={setBrandName} placeholder='e.g. Esika' />
                  </Field>
                  <Field label='Catalogue ID'>
                    <Input value={catalogueId} onChange={setCatalogueId} placeholder='e.g. BRAND-ESIKA-1' />
                  </Field>
                  <div className='sm:col-span-2 flex items-center gap-3 pt-1'>
                    <button
                      type='button'
                      onClick={() => setIsFeatured((v) => !v)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${isFeatured ? 'bg-rose-500 border-rose-500' : 'bg-stone-900 border-stone-600'}`}
                    >
                      {isFeatured && <Check size={12} className='text-white' />}
                    </button>
                    <span className='text-xs font-semibold uppercase tracking-widest text-stone-400'>
                      Feature this product (show in PDP banner)
                    </span>
                  </div>
                </div>
              </Section>

              <Section icon={Layers} title='Category' subtitle='Product categorisation'>
                <Select
                  label='Category'
                  required
                  value={categories.find((c) => c.category_id === categoryId)?.name}
                  onChange={(val) => { const selected = categories.find((c) => c.name === val); setCategoryId(selected.category_id) }}
                  options={categories.map((c) => c.name)}
                />
              </Section>

              <Section
                icon={Tag}
                title='Description Attributes'
                subtitle={
                  isSaree
                    ? 'Fabric, blouse & saree specifics'
                    : isLegging
                    ? 'Fabric, length & fit'
                    : isKurtisTops
                    ? 'Fabric, sleeve, neck, styling & length'
                    : isShawlCategory
                    ? 'Colour, material, design & size'
                    : isSuitSet3pc || isSuitSetTopDupatta || isSuitSetTopKurti || isDressMaterial
                    ? 'Per-component fabric, fit & set details'
                    : 'Fabric, sleeve, neck, styling'
                }
              >
                {isSaree ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <Select label='Material' value={material} onChange={setMaterial} options={MATERIALS} allowCustom />
                    <Select label='Color' value={sareeColor} onChange={setSareeColor} options={COLOR_OPTIONS} allowCustom />
                    <Select label='Design' value={design} onChange={setDesign} options={DESIGNS} allowCustom />
                    <Select label='Pattern' value={pattern} onChange={setPattern} options={PATTERNS} allowCustom />
                    <Select label='Type' value={sareeType} onChange={setSareeType} options={SAREE_TYPES} allowCustom />
                    <Select label='Blouse Included' value={blouseIncluded} onChange={setBlouseIncluded} options={BLOUSE_INCLUDED} />
                    <Select label='Number of Blouses' value={numberOfBlouses} onChange={setNumberOfBlouses} options={NUMBER_OF_BLOUSES} allowCustom />
                    <Select label='Blouse Type' value={blouseType} onChange={setBlouseType} options={BLOUSE_TYPES} allowCustom />
                    <Select label='Blouse Design' value={blouseDesign} onChange={setBlouseDesign} options={DESIGNS} allowCustom />
                    <Select label='Saree Length' value={sareeLength} onChange={setSareeLength} options={SAREE_LENGTHS} allowCustom />
                    <Select label='Blouse Material' value={blouseMaterial} onChange={setBlouseMaterial} options={MATERIALS} allowCustom />
                    <Select label='Saree Weight' value={sareeWeight} onChange={setSareeWeight} options={SAREE_WEIGHTS} allowCustom />
                    <Select label='Saree Border' value={sareeBorder} onChange={setSareeBorder} options={BORDER_TYPES} allowCustom />
                    <Select label='Blouse Color' value={blouseColor} onChange={setBlouseColor} options={COLOR_OPTIONS} allowCustom />
                    <Select label='Blouse Pattern' value={blousePattern} onChange={setBlousePattern} options={PATTERNS} allowCustom />
                    <Select label='Blouse Border' value={blouseBorder} onChange={setBlouseBorder} options={BORDER_TYPES} allowCustom />
                    <Select label='Blouse Size' value={blouseSize} onChange={setBlouseSize} options={ALL_SIZES} allowCustom />
                    <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                  </div>
                ) : isDressMaterial ? (
                  <div className='space-y-5'>
                    <div className='grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-800'>
                      <div className='space-y-5 sm:pr-5'>
                        <h4 className='text-xs font-bold text-stone-400 uppercase tracking-wide'>Top</h4>
                        <ColorPlate label='Colour' value={dmTopColor} onChange={setDmTopColor} />
                        <Select label='Material' value={dmTopMaterial} onChange={setDmTopMaterial} options={MATERIALS} allowCustom />
                        <Select label='Pattern' value={dmTopPattern} onChange={setDmTopPattern} options={PATTERNS} allowCustom />
                        <Select label='Design' value={dmTopDesign} onChange={setDmTopDesign} options={DESIGNS} allowCustom />
                        <Select label='Size' value={dmTopSize} onChange={setDmTopSize} options={ALL_SIZES} allowCustom />
                      </div>
                      <div className='space-y-5 pt-5 sm:pt-0 sm:px-5'>
                        <h4 className='text-xs font-bold text-stone-400 uppercase tracking-wide'>Bottom</h4>
                        <ColorPlate label='Colour' value={dmBottomColor} onChange={setDmBottomColor} />
                        <Select label='Material' value={dmBottomMaterial} onChange={setDmBottomMaterial} options={MATERIALS} allowCustom />
                        <Select label='Pattern' value={dmBottomPattern} onChange={setDmBottomPattern} options={PATTERNS} allowCustom />
                        <Select label='Design' value={dmBottomDesign} onChange={setDmBottomDesign} options={DESIGNS} allowCustom />
                        <Select label='Size' value={dmBottomSize} onChange={setDmBottomSize} options={ALL_SIZES} allowCustom />
                      </div>
                      <div className='space-y-5 pt-5 sm:pt-0 sm:pl-5'>
                        <h4 className='text-xs font-bold text-stone-400 uppercase tracking-wide'>Shawl</h4>
                        <ColorPlate label='Colour' value={dmShawlColor} onChange={setDmShawlColor} />
                        <Select label='Material' value={dmShawlMaterial} onChange={setDmShawlMaterial} options={MATERIALS} allowCustom />
                        <Select label='Pattern' value={dmShawlPattern} onChange={setDmShawlPattern} options={PATTERNS} allowCustom />
                        <Select label='Design' value={dmShawlDesign} onChange={setDmShawlDesign} options={DESIGNS} allowCustom />
                        <Select label='Size' value={dmShawlSize} onChange={setDmShawlSize} options={DUPATTA_SIZES} allowCustom />
                      </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                      <Select label='Type' value={dmStitchType} onChange={setDmStitchType} options={STITCH_TYPES} />
                      <Select label='Weight' value={dmWeight} onChange={setDmWeight} options={WEIGHTS} />
                      <Select label='Top Length' value={topLength} onChange={setTopLength} options={TOP_LENGTHS} allowCustom />
                      <Select label='Sleeve Length' value={sleeveLength} onChange={setSleeveLength} options={SLEEVE_LENGTH_OPTIONS} />
                      <Select label='Bottom Type' value={bottomType} onChange={setBottomType} options={BOTTOM_TYPES} allowCustom />
                      <Select label='Dupatta Size' value={dmDupattaSize} onChange={setDmDupattaSize} options={DUPATTA_SIZES} allowCustom />
                      <Select label='Pack Of' value={dmPackSize} onChange={setDmPackSize} options={PACK_SIZES} />
                      <Select label='Neck Design' value={neck} onChange={setNeck} options={NECK_OPTIONS} />
                      <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                    </div>
                  </div>
                ) : isLegging ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <Select label='Material' value={material} onChange={setMaterial} options={MATERIALS} allowCustom />
                    <Select label='Length Type' value={legLength} onChange={setLegLength} options={LENGTH_TYPES} />
                    <Select label='Colour' value={legColour} onChange={setLegColour} options={COLOR_OPTIONS} allowCustom />
                    <Select label='Design Pattern' value={design} onChange={setDesign} options={DESIGNS} allowCustom />
                    <Select label='Weight' value={legWeight} onChange={setLegWeight} options={WEIGHTS} />
                    <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                  </div>
                ) : isKurtisTops ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <Select label='Material' value={material} onChange={setMaterial} options={MATERIALS} allowCustom />
                    <Select label='Sleeve Length' value={sleeveLength} onChange={setSleeveLength} options={SLEEVE_LENGTH_OPTIONS} />
                    <Select label='Neck' value={neck} onChange={setNeck} options={NECK_OPTIONS} />
                    <Select label='Design Styling' value={designStyling} onChange={setDesignStyling} options={DESIGN_STYLING_OPTIONS} />
                    <Select label='Design' value={design} onChange={setDesign} options={DESIGNS} allowCustom />
                    <Select label='Top Length' value={topLength} onChange={setTopLength} options={TOP_LENGTHS} allowCustom />
                  </div>
                ) : isShawlCategory ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <Select label='Material' value={material} onChange={setMaterial} options={MATERIALS} allowCustom />
                    <Select label='Colour' value={shawlColor} onChange={setShawlColor} options={COLOR_OPTIONS} allowCustom />
                    <Select label='Design' value={design} onChange={setDesign} options={DESIGNS} allowCustom />
                    <Select label='Pattern' value={pattern} onChange={setPattern} options={PATTERNS} allowCustom />
                    <Select label='Size' value={shawlSize} onChange={setShawlSize} options={DUPATTA_SIZES} allowCustom />
                    <Select label='Weight' value={shawlWeight} onChange={setShawlWeight} options={WEIGHTS} />
                    <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                  </div>
                ) : isSuitSet3pc ? (
                  <div className='space-y-5'>
                    <div className='grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-800'>
                      <div className='space-y-5 sm:pr-5'>
                        <h4 className='text-xs font-bold text-stone-400 uppercase tracking-wide'>Top</h4>
                        <ColorPlate label='Colour' value={ssTopColor} onChange={setSsTopColor} />
                        <Select label='Material' value={ssTopMaterial} onChange={setSsTopMaterial} options={MATERIALS} allowCustom />
                        <Select label='Pattern' value={ssTopPattern} onChange={setSsTopPattern} options={PATTERNS} allowCustom />
                      </div>
                      <div className='space-y-5 pt-5 sm:pt-0 sm:px-5'>
                        <h4 className='text-xs font-bold text-stone-400 uppercase tracking-wide'>Bottom</h4>
                        <ColorPlate label='Colour' value={ssBottomColor} onChange={setSsBottomColor} />
                        <Select label='Material' value={ssBottomMaterial} onChange={setSsBottomMaterial} options={MATERIALS} allowCustom />
                        <Select label='Pattern' value={ssBottomPattern} onChange={setSsBottomPattern} options={PATTERNS} allowCustom />
                      </div>
                      <div className='space-y-5 pt-5 sm:pt-0 sm:pl-5'>
                        <h4 className='text-xs font-bold text-stone-400 uppercase tracking-wide'>Shawl</h4>
                        <ColorPlate label='Colour' value={ssShawlColor} onChange={setSsShawlColor} />
                        <Select label='Material' value={ssShawlMaterial} onChange={setSsShawlMaterial} options={MATERIALS} allowCustom />
                        <Select label='Pattern' value={ssShawlPattern} onChange={setSsShawlPattern} options={PATTERNS} allowCustom />
                      </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                      <Select label='Kurti Type' value={ssKurtiType} onChange={setSsKurtiType} options={KURTI_TYPES} allowCustom />
                      <Select label='Product Type' value={ssProductType} onChange={setSsProductType} options={PRODUCT_TYPES} allowCustom />
                      <Select label='Weight' value={ssWeight} onChange={setSsWeight} options={WEIGHTS} allowCustom />
                      <Select label='Top Length' value={topLength} onChange={setTopLength} options={TOP_LENGTHS} allowCustom />
                      <Select label='Sleeve Length' value={sleeveLength} onChange={setSleeveLength} options={SLEEVE_LENGTH_OPTIONS} allowCustom />
                      <Select label='Bottom Type' value={bottomType} onChange={setBottomType} options={BOTTOM_TYPES} allowCustom />
                      <Select label='Dupatta Size' value={ssDupattaSize} onChange={setSsDupattaSize} options={DUPATTA_SIZES} allowCustom />
                      <Select label='Pack Of' value={ssPackSize} onChange={setSsPackSize} options={PACK_SIZES} allowCustom />
                      <Select label='Neck Design' value={neck} onChange={setNeck} options={NECK_OPTIONS} allowCustom />
                      <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                    </div>
                  </div>
                ) : isSuitSetTopDupatta ? (
                  <div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-stone-800 gap-5 sm:gap-0'>
                      <div className='sm:pr-5 space-y-5'>
                        <p className='text-xs font-semibold uppercase tracking-widest text-stone-500'>Top</p>
                        <ColorPlate label='Colour' value={ssTopColor} onChange={setSsTopColor} />
                        <Select label='Material' value={ssTopMaterial} onChange={setSsTopMaterial} options={MATERIALS} allowCustom />
                        <Select label='Pattern' value={ssTopPattern} onChange={setSsTopPattern} options={PATTERNS} allowCustom />
                        <Select label='Design' value={ssTopDesign} onChange={setSsTopDesign} options={DESIGNS} allowCustom />
                      </div>
                      <div className='sm:pl-5 space-y-5'>
                        <p className='text-xs font-semibold uppercase tracking-widest text-stone-500'>Dupatta</p>
                        <ColorPlate label='Colour' value={ssShawlColor} onChange={setSsShawlColor} />
                        <Select label='Material' value={ssShawlMaterial} onChange={setSsShawlMaterial} options={MATERIALS} allowCustom />
                        <Select label='Pattern' value={ssShawlPattern} onChange={setSsShawlPattern} options={PATTERNS} allowCustom />
                        <Select label='Design' value={ssShawlDesign} onChange={setSsShawlDesign} options={DESIGNS} allowCustom />
                      </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5'>
                      <Select label='Product Type' value={ssProductType} onChange={setSsProductType} options={PRODUCT_TYPES} />
                      <Select label='Weight' value={ssWeight} onChange={setSsWeight} options={WEIGHTS} />
                      <Select label='Top Length' value={topLength} onChange={setTopLength} options={TOP_LENGTHS} allowCustom />
                      <Select label='Sleeve Length' value={sleeveLength} onChange={setSleeveLength} options={SLEEVE_LENGTH_OPTIONS} />
                      <Select label='Dupatta Size' value={ssDupattaSize} onChange={setSsDupattaSize} options={DUPATTA_SIZES} allowCustom />
                      <Select label='Pack Of' value={ssPackSize} onChange={setSsPackSize} options={PACK_SIZES} />
                      <Select label='Neck Design' value={neck} onChange={setNeck} options={NECK_OPTIONS} />
                      <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                    </div>
                  </div>
                ) : isSuitSetTopKurti ? (
                  <div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-stone-800 gap-5 sm:gap-0'>
                      <div className='sm:pr-5 space-y-5'>
                        <p className='text-xs font-semibold uppercase tracking-widest text-stone-500'>Top</p>
                        <ColorPlate label='Colour' value={ssTopColor} onChange={setSsTopColor} />
                        <Select label='Material' value={ssTopMaterial} onChange={setSsTopMaterial} options={MATERIALS} allowCustom />
                        <Select label='Pattern' value={ssTopPattern} onChange={setSsTopPattern} options={PATTERNS} allowCustom />
                        <Select label='Design' value={ssTopDesign} onChange={setSsTopDesign} options={DESIGNS} allowCustom />
                      </div>
                      <div className='sm:pl-5 space-y-5'>
                        <p className='text-xs font-semibold uppercase tracking-widest text-stone-500'>Kurti</p>
                        <ColorPlate label='Colour' value={ssKurtiColor} onChange={setSsKurtiColor} />
                        <Select label='Material' value={ssKurtiMaterial} onChange={setSsKurtiMaterial} options={MATERIALS} allowCustom />
                        <Select label='Pattern' value={ssKurtiPattern} onChange={setSsKurtiPattern} options={PATTERNS} allowCustom />
                        <Select label='Design' value={ssKurtiDesign} onChange={setSsKurtiDesign} options={DESIGNS} allowCustom />
                      </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5'>
                      <Select label='Product Type' value={ssProductType} onChange={setSsProductType} options={PRODUCT_TYPES} />
                      <Select label='Weight' value={ssWeight} onChange={setSsWeight} options={WEIGHTS} />
                      <Select label='Top Length' value={topLength} onChange={setTopLength} options={TOP_LENGTHS} allowCustom />
                      <Select label='Sleeve Length' value={sleeveLength} onChange={setSleeveLength} options={SLEEVE_LENGTH_OPTIONS} />
                      <Select label='Pack Of' value={ssPackSize} onChange={setSsPackSize} options={PACK_SIZES} />
                      <Select label='Neck Design' value={neck} onChange={setNeck} options={NECK_OPTIONS} />
                      <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                    </div>
                  </div>
                ) : isDresses ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <Select label='Material' value={material} onChange={setMaterial} options={MATERIALS} allowCustom />
                    <Select label='Sleeve Length' value={sleeveLength} onChange={setSleeveLength} options={SLEEVE_LENGTH_OPTIONS} />
                    <Select label='Neck' value={neck} onChange={setNeck} options={NECK_OPTIONS} />
                    <Select label='Design Styling' value={designStyling} onChange={setDesignStyling} options={DESIGN_STYLING_OPTIONS} />
                    <Select label='Design' value={design} onChange={setDesign} options={DESIGNS} allowCustom />
                    <Select label='Colour' value={dressColour} onChange={setDressColour} options={COLOR_OPTIONS} allowCustom />
                    <Select label='Top Length' value={topLength} onChange={setTopLength} options={TOP_LENGTHS} allowCustom />
                    <Select label='Weight' value={dressWeight} onChange={setDressWeight} options={WEIGHTS} />
                    <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                  </div>
                ) : isTunics ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <Select label='Material' value={material} onChange={setMaterial} options={MATERIALS} allowCustom />
                    <Select label='Sleeve Length' value={sleeveLength} onChange={setSleeveLength} options={SLEEVE_LENGTH_OPTIONS} />
                    <Select label='Neck' value={neck} onChange={setNeck} options={NECK_OPTIONS} />
                    <Select label='Design Styling' value={designStyling} onChange={setDesignStyling} options={DESIGN_STYLING_OPTIONS} />
                    <Select label='Design' value={design} onChange={setDesign} options={DESIGNS} allowCustom />
                    <Select label='Colour' value={tunicColour} onChange={setTunicColour} options={COLOR_OPTIONS} allowCustom />
                    <Select label='Weight' value={tunicWeight} onChange={setTunicWeight} options={WEIGHTS} />
                    <Select label='Top Type' value={tunicTopType} onChange={setTunicTopType} options={TOP_TYPES} allowCustom />
                    <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                  </div>
                ) : isStraightPants ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <Select label='Material' value={material} onChange={setMaterial} options={MATERIALS} allowCustom />
                    <Select label='Sleeve Length' value={sleeveLength} onChange={setSleeveLength} options={SLEEVE_LENGTH_OPTIONS} />
                    <Select label='Neck' value={neck} onChange={setNeck} options={NECK_OPTIONS} />
                    <Select label='Design Styling' value={designStyling} onChange={setDesignStyling} options={DESIGN_STYLING_OPTIONS} />
                    <Select label='Design' value={design} onChange={setDesign} options={DESIGNS} allowCustom />
                    <Select label='Bottom Type' value={bottomType} onChange={setBottomType} options={BOTTOM_TYPES} allowCustom />
                    <Select label='Colour' value={pantsColour} onChange={setPantsColour} options={COLOR_OPTIONS} allowCustom />
                    <Select label='Weight' value={pantsWeight} onChange={setPantsWeight} options={WEIGHTS} />
                    <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <Select label='Material' value={material} onChange={setMaterial} options={MATERIALS} allowCustom />
                    <Select label='Sleeve Length' value={sleeveLength} onChange={setSleeveLength} options={SLEEVE_LENGTH_OPTIONS} />
                    <Select label='Neck' value={neck} onChange={setNeck} options={NECK_OPTIONS} />
                    <Select label='Design Styling' value={designStyling} onChange={setDesignStyling} options={DESIGN_STYLING_OPTIONS} />
                    <Select label='Design' value={design} onChange={setDesign} options={DESIGNS} allowCustom />
                    <Select label='Bottom Type' value={bottomType} onChange={setBottomType} options={BOTTOM_TYPES} allowCustom />
                    <Select label='Occasion' value={occasion} onChange={setOccasion} options={OCCASIONS} allowCustom />
                  </div>
                )}
              </Section>

              <Section icon={Tag} title='Description & Product Info' subtitle='Shown on the storefront product page'>
                <Field label='Description'>
                  <Textarea value={description} onChange={setDescription} placeholder='Crafted from premium fabric, this piece features...' rows={4} />
                </Field>
                <Field label='Product Info' hint='One highlight per line'>
                  <Textarea value={highlights} onChange={setHighlights} placeholder={'Premium fabric\nStraight fit silhouette\nThree-quarter sleeves'} rows={4} />
                </Field>
              </Section>

              <Section icon={DollarSign} title='Pricing' subtitle='MRP, sale price, buy price & GST'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <Field label='MRP' required><Input value={mrp} onChange={setMrp} type='number' placeholder='0.00' prefix='₹' /></Field>
                  <Field label='Sale Price' required><Input value={salePrice} onChange={setSalePrice} type='number' placeholder='0.00' prefix='₹' /></Field>
                  <Field label='Buy Price' hint='Not shown to customers'><Input value={buyPrice} onChange={setBuyPrice} type='number' placeholder='0.00' prefix='₹' /></Field>
                  <Field label='GST (%)'><Input value={gst} onChange={setGst} type='number' placeholder='e.g. 5.2' /></Field>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4'>
                    <Select label='Discount Type' value={discountType} onChange={setDiscountType} options={['FLAT', 'PERCENTAGE']} />
                    <Field label='Discount Value'><Input value={discountValue} onChange={setDiscountValue} type='number' placeholder='Enter value' /></Field>
                  </div>
                </div>

                {mrp && salePrice && buyPrice && (
                  <div className='flex items-center gap-4 p-4 bg-stone-900 rounded-xl border border-stone-800 text-sm flex-wrap'>
                    <div>
                      <p className='text-stone-500 text-xs'>Final Price</p>
                      <p className='font-bold text-blue-400'>₹{discountData.finalPrice.toLocaleString()}</p>
                    </div>
                    <div className='w-px h-8 bg-stone-700' />
                    <div>
                      <p className='text-stone-500 text-xs'>Margin</p>
                      <p className='font-bold text-emerald-400'>₹{(discountData.finalPrice - parseFloat(buyPrice)).toLocaleString()}</p>
                    </div>
                    <div className='w-px h-8 bg-stone-700' />
                    <div>
                      <p className='text-stone-500 text-xs'>Margin %</p>
                      <p className='font-bold text-emerald-400'>
                        {discountData.finalPrice > 0 ? Math.round(((discountData.finalPrice - parseFloat(buyPrice)) / discountData.finalPrice) * 100) : 0}%
                      </p>
                    </div>
                    {discountData.percent > 0 && (
                      <>
                        <div className='w-px h-8 bg-stone-700' />
                        <div>
                          <p className='text-stone-500 text-xs'>Discount shown</p>
                          <p className='font-bold text-rose-400'>{discountData.percent}% off</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Section>

              <Section icon={Image} title='Inventory & Variants' subtitle='Color variants with sizes, quantities and images'>
                <div className='space-y-8'>
                  {variants.map((variant, vi) => (
                    <VariantCard
                      key={variant.id}
                      variant={variant}
                      index={vi}
                      onColorsChange={(val) => setVariantField(variant.id, 'colors', val)}
                      onSizeQtyChange={(size, qty) => setVariantSize(variant.id, size, qty)}
                      categoryType={categoryType}
                      onComponentSizeQtyChange={(component, size, qty) => setVariantComponentSize(variant.id, component, size, qty)}
                      onMainImage={(e) => handleMainImage(variant.id, e)}
                      onRemoveMainImage={() => removeMainImage(variant.id)}
                      onOtherImages={(e) => handleOtherImages(variant.id, e)}
                      onRemoveOtherImage={(imgId) => removeOtherImage(variant.id, imgId)}
                      onRemoveVariant={variants.length > 1 ? () => removeVariant(variant.id) : null}
                    />
                  ))}
                </div>
                <button
                  type='button'
                  onClick={addVariant}
                  className='w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-stone-700 hover:border-rose-500 rounded-xl text-sm text-stone-500 hover:text-rose-400 transition-colors'
                >
                  <Plus size={16} /> Add Another Color Variant
                </button>
              </Section>

              <Section icon={Image} title='Product Videos' subtitle='Optional — paste up to 2 video URLs to show on the product page'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <Field label='Video URL 1'>
                    <Input value={videoUrl1} onChange={setVideoUrl1} placeholder='https://youtube.com/watch?v=...' />
                  </Field>
                  <Field label='Video URL 2'>
                    <Input value={videoUrl2} onChange={setVideoUrl2} placeholder='https://youtube.com/watch?v=...' />
                  </Field>
                </div>
              </Section>

              {/* Mobile action buttons */}
              <div className='flex gap-3 md:hidden pb-4'>
                <button onClick={handleSaveDraft} className='flex-1 py-3 rounded-xl text-sm font-semibold border border-stone-700 text-stone-300'>
                  Save Draft
                </button>
                <button onClick={handleUpdate} disabled={submitting} className='flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-600 text-white disabled:opacity-60'>
                  {submitting ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* RIGHT: preview + checklist */}
          <div className={`space-y-6 ${activeTab === 'preview' ? 'lg:col-span-2' : ''}`}>
            <Preview />
            <div className='bg-stone-950 border border-stone-800 rounded-2xl p-5'>
              <h4 className='text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4'>Checklist</h4>
              <div className='space-y-3'>
                {checks.map(({ label, done }) => (
                  <div key={label} className='flex items-center gap-3'>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-600'}`}>
                      {done ? <Check size={11} /> : <AlertCircle size={11} />}
                    </div>
                    <span className={`text-xs ${done ? 'text-stone-300 line-through decoration-stone-600' : 'text-stone-500'}`}>{label}</span>
                  </div>
                ))}
              </div>
              <div className='mt-4'>
                <div className='flex justify-between items-center mb-1.5'>
                  <span className='text-xs text-stone-600'>Listing completeness</span>
                  <span className='text-xs font-bold text-rose-400'>{completeness}%</span>
                </div>
                <div className='h-1.5 bg-stone-800 rounded-full overflow-hidden'>
                  <div className='h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500' style={{ width: `${completeness}%` }} />
                </div>
              </div>
            </div>

            <div className='bg-stone-950 border border-stone-800 rounded-2xl p-5'>
              <h4 className='text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3'>SEO Preview</h4>
              <div className='p-3 bg-white rounded-xl'>
                <p className='text-blue-700 text-sm font-medium truncate'>{title || 'Product Title'} — YourStore.com</p>
                <p className='text-green-700 text-xs mt-0.5 truncate'>
                  yourstore.com/products/{title ? title.toLowerCase().replace(/\s+/g, '-') : 'product-name'}
                </p>
                <p className='text-gray-500 text-xs mt-1'>
                  {(isSaree
                    ? [material, sareeColor, design, pattern, sareeType]
                    : isDressMaterial
                    ? [dmTopMaterial, dmBottomMaterial, dmShawlMaterial, dmStitchType, topLength]
                    : isLegging
                    ? [material, legLength, legColour, design]
                    : isKurtisTops
                    ? [material, sleeveLength, neck, designStyling, design, topLength]
                    : isShawlCategory
                    ? [material, shawlColor, design, pattern, shawlSize, shawlWeight]
                    : isSuitSet3pc
                    ? [ssTopMaterial, ssBottomMaterial, ssShawlMaterial, ssProductType, topLength]
                    : isSuitSetTopDupatta
                    ? [ssTopMaterial, ssShawlMaterial, ssProductType, topLength]
                    : isSuitSetTopKurti
                    ? [ssTopMaterial, ssKurtiMaterial, ssProductType, topLength]
                    : [material, sleeveLength, neck, designStyling, design, bottomType]
                  )
                    .filter(Boolean)
                    .join(' · ') || 'Add description attributes to improve search visibility…'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Variant Card ──────────────────────────────────────────────────────────────
const VariantCard = ({
  variant, index,
  onColorsChange, onSizeQtyChange,
  categoryType, onComponentSizeQtyChange,
  onMainImage, onRemoveMainImage,
  onOtherImages, onRemoveOtherImage,
  onRemoveVariant,
}) => {
  const mainRef = useRef()
  const otherRef = useRef()
  const anyOtherUploading = variant.other_image_filenames.some((f) => f.uploading)

  return (
    <div className='border border-stone-800 rounded-2xl overflow-hidden bg-stone-900/30'>
      <div className='flex items-center justify-between px-5 py-3 border-b border-stone-800 bg-stone-900/60'>
        <span className='text-xs font-semibold uppercase tracking-widest text-rose-400'>
          Variant {index + 1}{variant.colors?.length ? ` · ${variant.colors.join(', ')}` : ''}
        </span>
        {onRemoveVariant && (
          <button onClick={onRemoveVariant} className='p-1 text-stone-600 hover:text-rose-400 transition-colors'>
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className='p-5 space-y-5'>
        {!PER_PART_COLOR_TYPES.includes(categoryType) && (
          <>
            <Select label='Color' required value={variant.colors} onChange={onColorsChange} options={COLOR_OPTIONS} multiple />
            <p className='-mt-3 text-xs text-stone-500'>
              Pick multiple colors if this variant (same images, sizes & stock) comes in more than one color.
            </p>
          </>
        )}

        {categoryType === 'saree' ? (
          <div>
            <label className='block text-xs font-semibold uppercase tracking-widest text-rose-400 mb-3'>Stock (Free Size)</label>
            <input
              type='number'
              min='0'
              value={variant.sizes.find((s) => s.size === 'Free Size')?.quantity ?? ''}
              onChange={(e) => onSizeQtyChange('Free Size', e.target.value)}
              placeholder='Qty'
              className='w-full max-w-[140px] text-center px-2 py-2 bg-stone-900 border border-stone-700 rounded-lg text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-rose-500 transition-colors'
            />
          </div>
        ) : COMPONENTS_BY_TYPE[categoryType] ? (
          <div className='space-y-5'>
            {COMPONENTS_BY_TYPE[categoryType].map((component) => (
              <div key={component}>
                <label className='block text-xs font-semibold uppercase tracking-widest text-rose-400 mb-3 capitalize'>
                  {component} · Sizes & Quantities
                </label>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                  {variant.componentSizes[component].map(({ size, quantity }) => (
                    <div key={size} className='space-y-1'>
                      <div className={`text-center text-xs font-semibold py-1.5 rounded-lg border transition-colors ${
                        quantity !== '' && parseInt(quantity) > 0
                          ? 'border-rose-500 bg-rose-500/10 text-rose-300'
                          : 'border-stone-700 text-stone-500'
                      }`}>
                        {size}
                      </div>
                      <input
                        type='number'
                        min='0'
                        value={quantity}
                        onChange={(e) => onComponentSizeQtyChange(component, size, e.target.value)}
                        placeholder='Qty'
                        className='w-full text-center px-2 py-2 bg-stone-900 border border-stone-700 rounded-lg text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-rose-500 transition-colors'
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <label className='block text-xs font-semibold uppercase tracking-widest text-rose-400 mb-3'>Sizes & Quantities</label>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              {variant.sizes.map(({ size, quantity }) => (
                <div key={size} className='space-y-1'>
                  <div className={`text-center text-xs font-semibold py-1.5 rounded-lg border transition-colors ${
                    quantity !== '' && parseInt(quantity) > 0
                      ? 'border-rose-500 bg-rose-500/10 text-rose-300'
                      : 'border-stone-700 text-stone-500'
                  }`}>
                    {size}
                  </div>
                  <input
                    type='number'
                    min='0'
                    value={quantity}
                    onChange={(e) => onSizeQtyChange(size, e.target.value)}
                    placeholder='Qty'
                    className='w-full text-center px-2 py-2 bg-stone-900 border border-stone-700 rounded-lg text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-rose-500 transition-colors'
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Image */}
        <div>
          <label className='block text-xs font-semibold uppercase tracking-widest text-rose-400 mb-2'>
            Main Image <span className='text-rose-500'>*</span>
          </label>
          {variant.main_image_preview ? (
            <div className='relative group rounded-xl overflow-hidden border-2 border-rose-500/40 aspect-[4/3] bg-stone-900'>
              <img src={variant.main_image_preview.src} alt='main' className='w-full h-full object-contain' />
              {variant.main_image_uploading && (
                <div className='absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2'>
                  <Loader2 size={24} className='text-rose-400 animate-spin' />
                  <span className='text-xs text-stone-300'>Uploading…</span>
                </div>
              )}
              {!variant.main_image_uploading && (
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3'>
                  <button onClick={() => mainRef.current.click()} className='px-3 py-1.5 bg-white/20 backdrop-blur rounded-lg text-white text-xs font-medium hover:bg-white/30 transition'>
                    Change
                  </button>
                  <button
                    onClick={() => { mainRef.current.value = ''; onRemoveMainImage() }}
                    className='px-3 py-1.5 bg-rose-500/80 backdrop-blur rounded-lg text-white text-xs font-medium hover:bg-rose-500 transition'
                  >
                    Remove
                  </button>
                </div>
              )}
              {/* Badge: "Existing" for server images, "New" for just-picked files */}
              <div className={`absolute bottom-2 right-2 text-white text-xs font-bold px-2 py-0.5 rounded-full ${
                variant.main_image_file ? 'bg-amber-500' : 'bg-emerald-500'
              }`}>
                {variant.main_image_file ? 'New (unsaved)' : 'Saved ✓'}
              </div>
            </div>
          ) : (
            <button
              onClick={() => mainRef.current.click()}
              className='w-full border-2 border-dashed border-stone-700 hover:border-rose-500 rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-2 transition-colors group bg-stone-900/50 hover:bg-rose-500/5'
            >
              <div className='w-12 h-12 rounded-xl bg-stone-800 group-hover:bg-rose-500/10 flex items-center justify-center transition-colors'>
                <Upload size={22} className='text-stone-500 group-hover:text-rose-400 transition-colors' />
              </div>
              <p className='text-sm font-semibold text-stone-400 group-hover:text-rose-400 transition-colors'>Upload Main Photo</p>
              <p className='text-xs text-stone-600'>PNG, JPG up to 10MB</p>
            </button>
          )}
          <input ref={mainRef} type='file' accept='image/*' className='hidden' onChange={onMainImage} />
        </div>

        {/* Other Images */}
        <div>
          <label className='block text-xs font-semibold uppercase tracking-widest text-rose-400 mb-2'>
            Other Images{' '}
            <span className='text-stone-600 font-normal normal-case tracking-normal ml-1'>
              ({variant.other_image_previews.length}/8)
            </span>
          </label>
          <div className='grid grid-cols-4 gap-2'>
            {variant.other_image_previews.map((img) => {
              const uploadState = variant.other_image_filenames.find((f) => f.id === img.id)
              const isUploading = uploadState?.uploading
              const isNewFile = uploadState && uploadState.filename === ''
              return (
                <div key={img.id} className='relative group aspect-square rounded-xl overflow-hidden border border-stone-700 bg-stone-900'>
                  <img src={img.src} alt='' className='w-full h-full object-cover' />
                  {isUploading && (
                    <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                      <Loader2 size={16} className='text-rose-400 animate-spin' />
                    </div>
                  )}
                  {/* Saved tick for existing server images */}
                  {!isUploading && !isNewFile && uploadState?.filename && (
                    <div className='absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center'>
                      <Check size={9} className='text-white' />
                    </div>
                  )}
                  {/* "New" badge for newly picked files */}
                  {!isUploading && isNewFile && (
                    <div className='absolute top-1 right-1 bg-amber-500 text-white text-[9px] font-bold px-1 rounded'>NEW</div>
                  )}
                  {!isUploading && (
                    <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <button onClick={() => onRemoveOtherImage(img.id)} className='p-1.5 bg-rose-500 rounded-full text-white hover:bg-rose-600 transition'>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
            {variant.other_image_previews.length < 8 && (
              <button
                onClick={() => otherRef.current.click()}
                className='aspect-square rounded-xl border-2 border-dashed border-stone-700 hover:border-rose-500 flex flex-col items-center justify-center gap-1 transition-colors group hover:bg-rose-500/5'
              >
                <Plus size={18} className='text-stone-600 group-hover:text-rose-400 transition-colors' />
                <span className='text-xs text-stone-600 group-hover:text-rose-400 transition-colors'>Add</span>
              </button>
            )}
          </div>
          <input ref={otherRef} type='file' accept='image/*' multiple className='hidden' onChange={onOtherImages} />
          {anyOtherUploading && (
            <p className='mt-2 text-xs text-amber-400 flex items-center gap-1'>
              <Loader2 size={11} className='animate-spin' /> Uploading images…
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductEdit
