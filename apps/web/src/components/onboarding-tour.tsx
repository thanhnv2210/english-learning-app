'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ── Storage keys ──────────────────────────────────────────────────────────────
const TOUR_KEY = 'ielts-tour-dismissed'
const LANG_KEY = 'ielts-lang'

// ── Types ─────────────────────────────────────────────────────────────────────
type Lang = 'en' | 'vi'

type Step = {
  target: string   // matches data-tour="..."
  title: string
  body: string
}

// ── Translations ──────────────────────────────────────────────────────────────
const STEPS: Record<Lang, Step[]> = {
  en: [
    {
      target: 'target-profile',
      title: 'Your Target Band',
      body: 'This shows your current IELTS target (e.g. Band 6.5). To change it, open ⚙️ Settings at the bottom of the sidebar and select a new target profile.',
    },
    {
      target: 'pin-page',
      title: 'Pin Any Page',
      body: 'Hover over any page link and click the ☆ star icon that appears on the right. Pinned pages jump to a "Favourites" section at the top of the sidebar so you can reach them in one click.',
    },
    {
      target: 'cheat-sheet',
      title: 'Cheat Sheet — Start Here',
      body: 'Open the Guides section and click "Cheat Sheet". It maps every tool in the app to a specific IELTS problem — the fastest way to know what to practice next.',
    },
    {
      target: 'sign-out',
      title: 'Sign Out',
      body: 'Click the ↩ arrow next to your name at the bottom of the sidebar to sign out. You\'ll be returned to the home page.',
    },
  ],
  vi: [
    {
      target: 'target-profile',
      title: 'Band mục tiêu của bạn',
      body: 'Đây là band IELTS bạn đang nhắm tới (ví dụ: Band 6.5). Để thay đổi, mở ⚙️ Settings ở cuối sidebar và chọn mục tiêu mới.',
    },
    {
      target: 'pin-page',
      title: 'Ghim trang yêu thích',
      body: 'Di chuột qua bất kỳ đường dẫn nào và nhấn biểu tượng ☆ hiện ra bên phải. Trang đã ghim sẽ xuất hiện trong mục "Favourites" ở đầu sidebar để truy cập nhanh.',
    },
    {
      target: 'cheat-sheet',
      title: 'Cheat Sheet — Bắt đầu tại đây',
      body: 'Mở mục Guides và nhấn "Cheat Sheet". Tài liệu này ánh xạ từng công cụ trong ứng dụng với một vấn đề IELTS cụ thể — cách nhanh nhất để biết nên luyện gì tiếp theo.',
    },
    {
      target: 'sign-out',
      title: 'Đăng xuất',
      body: 'Nhấn mũi tên ↩ bên cạnh tên của bạn ở cuối sidebar để đăng xuất. Bạn sẽ được chuyển về trang chủ.',
    },
  ],
}

// ── Padding around the spotlight rect ────────────────────────────────────────
const PAD = 8

export function OnboardingTour() {
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)
  const [lang, setLang] = useState<Lang>('en')
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!localStorage.getItem(TOUR_KEY)) setActive(true)
    const stored = localStorage.getItem(LANG_KEY)
    if (stored === 'en' || stored === 'vi') setLang(stored)
  }, [])

  const measureTarget = useCallback((stepIndex: number, currentLang: Lang) => {
    const target = STEPS[currentLang][stepIndex]?.target
    if (!target) return
    const el = document.querySelector(`[data-tour="${target}"]`)
    setRect(el ? el.getBoundingClientRect() : null)
  }, [])

  useEffect(() => {
    if (!active) return
    measureTarget(step, lang)
    // Re-measure on resize
    const handler = () => measureTarget(step, lang)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [active, step, lang, measureTarget])

  function dismiss() {
    localStorage.setItem(TOUR_KEY, '1')
    setActive(false)
  }

  function next() {
    const steps = STEPS[lang]
    if (step < steps.length - 1) setStep((s) => s + 1)
    else dismiss()
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1)
  }

  function toggleLang() {
    const next: Lang = lang === 'en' ? 'vi' : 'en'
    setLang(next)
    localStorage.setItem(LANG_KEY, next)
  }

  if (!mounted || !active) return null

  const steps = STEPS[lang]
  const current = steps[step]
  const isLast = step === steps.length - 1

  // ── Spotlight geometry ────────────────────────────────────────────────────
  const spotX = rect ? rect.left - PAD : -9999
  const spotY = rect ? rect.top - PAD : -9999
  const spotW = rect ? rect.width + PAD * 2 : 0
  const spotH = rect ? rect.height + PAD * 2 : 0

  // ── Tooltip position: prefer right of spotlight, clamp to viewport ─────────
  const TOOLTIP_W = 296
  const TOOLTIP_GAP = 14
  const viewW = typeof window !== 'undefined' ? window.innerWidth : 1200
  const viewH = typeof window !== 'undefined' ? window.innerHeight : 800

  let ttX = rect ? spotX + spotW + TOOLTIP_GAP : (viewW - TOOLTIP_W) / 2
  let ttY = rect ? spotY : (viewH - 240) / 2

  // Flip left if overflows right edge
  if (ttX + TOOLTIP_W > viewW - 12) ttX = rect ? spotX - TOOLTIP_W - TOOLTIP_GAP : ttX
  // Clamp top
  if (ttY < 12) ttY = 12
  if (ttY + 240 > viewH - 12) ttY = viewH - 252

  return createPortal(
    <div
      className="fixed inset-0 z-[9998]"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'en' ? 'App tour' : 'Hướng dẫn sử dụng'}
    >
      {/* ── Dark overlay with spotlight cutout ─────────────────────────────── */}
      {rect ? (
        <div
          className="pointer-events-none fixed rounded-lg"
          style={{
            left: spotX,
            top: spotY,
            width: spotW,
            height: spotH,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
            borderRadius: 8,
            transition: 'left 0.25s ease, top 0.25s ease, width 0.25s ease, height 0.25s ease',
          }}
        />
      ) : (
        <div className="pointer-events-none fixed inset-0 bg-black/65" />
      )}

      {/* ── Tooltip card ───────────────────────────────────────────────────── */}
      <div
        className="fixed z-[9999] w-[296px] rounded-2xl border border-border bg-card shadow-2xl"
        style={{
          left: ttX,
          top: ttY,
          transition: 'left 0.25s ease, top 0.25s ease',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              {step + 1} / {steps.length}
            </span>
            <span className="flex gap-0.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 rounded-full transition-all ${
                    i === step
                      ? 'w-4 bg-blue-500'
                      : i < step
                      ? 'w-2 bg-blue-300/60'
                      : 'w-2 bg-muted'
                  }`}
                />
              ))}
            </span>
          </div>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="rounded-md border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {lang === 'en' ? 'VI' : 'EN'}
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4">
          <p className="mb-2 text-sm font-semibold text-foreground">{current.title}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{current.body}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <button
            onClick={dismiss}
            className="text-xs text-faint hover:text-muted-foreground transition-colors"
          >
            {lang === 'en' ? 'Skip tour' : 'Bỏ qua'}
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={prev}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {lang === 'en' ? '← Back' : '← Quay lại'}
              </button>
            )}
            <button
              onClick={next}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              {isLast
                ? lang === 'en' ? 'Done' : 'Xong'
                : lang === 'en' ? 'Next →' : 'Tiếp →'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
