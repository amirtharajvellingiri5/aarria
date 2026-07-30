import React, { useState, useEffect } from 'react'
import {
  RefreshCw,
  AlertTriangle,
  Database,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react'

import AdminNav from './AdminNav'
import { INVENTORY_URL } from '../config'
import { useAuthStore } from '../store/authStore'
const authHeaders = () => ({ Authorization: `Bearer ${useAuthStore.getState().token || ''}` })

const CDN = 'https://cdn.vaarria.com/'
const API = `${INVENTORY_URL}/products/orphans`

const formatBytes = (n) => {
  if (!n) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(1)} ${units[i]}`
}

// ── Main Component ────────────────────────────────────────────────────────────
const OrphanReport = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrphans()
  }, [])

  const fetchOrphans = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(API, { headers: authHeaders() })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setData(await res.json())
    } catch {
      setError('Failed to load orphan report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='min-h-screen bg-stone-950 text-stone-100'
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href='https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap'
        rel='stylesheet'
      />

      <AdminNav />

      <div className='max-w-7xl mx-auto px-6 py-8 space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-lg font-bold text-stone-100'>Orphan Report</h1>
            <p className='text-xs text-stone-500'>
              Cloudflare KV keys and R2 images with no matching DynamoDB product.
            </p>
          </div>
          <button
            onClick={fetchOrphans}
            disabled={loading}
            className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100 transition-colors disabled:opacity-40'
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className='flex items-center justify-center gap-3 py-20 text-stone-500'>
            <Loader2 size={18} className='animate-spin' /> Scanning DynamoDB, KV and R2…
          </div>
        ) : error ? (
          <div className='flex flex-col items-center justify-center gap-3 py-20 text-stone-500'>
            <AlertTriangle size={24} className='text-rose-400' />
            <p className='text-sm'>{error}</p>
            <button
              onClick={fetchOrphans}
              className='px-4 py-2 rounded-xl text-sm border border-stone-700 text-stone-300 hover:border-stone-500 transition-colors'
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-stone-950 border border-stone-800 rounded-2xl px-5 py-4'>
                <p className='text-xs text-stone-500'>DynamoDB products</p>
                <p className='text-2xl font-bold text-stone-100'>{data.dynamo_product_count}</p>
                <p className='text-xs text-stone-600 mt-1'>{data.kv_product_key_count} KV product keys</p>
              </div>
              <div className='bg-stone-950 border border-stone-800 rounded-2xl px-5 py-4'>
                <p className='text-xs text-stone-500'>R2 images</p>
                <p className='text-2xl font-bold text-stone-100'>{data.r2_image_count}</p>
                <p className='text-xs text-stone-600 mt-1'>referenced by DynamoDB</p>
              </div>
            </div>

            <div className='bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden'>
              <div className='flex items-center gap-2 px-5 py-4 border-b border-stone-800 bg-stone-900/40'>
                <Database size={14} className='text-rose-400' />
                <h2 className='text-sm font-bold text-stone-100'>
                  Orphan KV keys ({data.orphan_kv.length})
                </h2>
              </div>
              <div className='overflow-x-auto'>
                {data.orphan_kv.length === 0 ? (
                  <p className='py-10 text-center text-sm text-stone-500'>No orphan KV keys found</p>
                ) : (
                  <table className='w-full'>
                    <thead>
                      <tr className='bg-stone-900/60'>
                        <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-stone-500'>
                          Key
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-stone-500'>
                          Title (from value)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orphan_kv.map((o, i) => (
                        <tr
                          key={o.key}
                          className={`border-t border-stone-800/60 hover:bg-stone-900/40 transition-colors ${i % 2 === 0 ? '' : 'bg-stone-900/10'}`}
                        >
                          <td className='px-4 py-3 text-sm font-mono text-stone-300'>{o.key}</td>
                          <td className='px-4 py-3 text-sm text-stone-400'>{o.title || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className='bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden'>
              <div className='flex items-center gap-2 px-5 py-4 border-b border-stone-800 bg-stone-900/40'>
                <ImageIcon size={14} className='text-rose-400' />
                <h2 className='text-sm font-bold text-stone-100'>
                  Orphan images ({data.orphan_images.length})
                </h2>
              </div>
              <div className='overflow-x-auto'>
                {data.orphan_images.length === 0 ? (
                  <p className='py-10 text-center text-sm text-stone-500'>No orphan images found</p>
                ) : (
                  <table className='w-full'>
                    <thead>
                      <tr className='bg-stone-900/60'>
                        <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-stone-500'>
                          Preview
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-stone-500'>
                          Key
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-stone-500'>
                          Size
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-stone-500'>
                          Last modified
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orphan_images.map((o, i) => (
                        <tr
                          key={o.key}
                          className={`border-t border-stone-800/60 hover:bg-stone-900/40 transition-colors ${i % 2 === 0 ? '' : 'bg-stone-900/10'}`}
                        >
                          <td className='px-4 py-3'>
                            <img
                              src={`${CDN}${o.key}`}
                              alt=''
                              className='w-10 h-10 rounded-lg object-cover border border-stone-700'
                              onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                            />
                          </td>
                          <td className='px-4 py-3 text-sm font-mono text-stone-300 max-w-[360px] truncate'>
                            {o.key}
                          </td>
                          <td className='px-4 py-3 text-sm text-stone-400'>{formatBytes(o.size)}</td>
                          <td className='px-4 py-3 text-sm text-stone-500'>
                            {new Date(o.last_modified).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrphanReport
