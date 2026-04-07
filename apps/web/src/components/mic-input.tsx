'use client'

import { useSpeechInput } from '@/lib/ielts/timer/use-speech-input'

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
}

export function MicInput({ value, onChange, onSubmit, disabled, placeholder = 'Type or speak your answer…' }: Props) {
  const speech = useSpeechInput({
    onTranscript: (text) => {
      onChange(value ? value + ' ' + text : text)
    },
  })

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) onSubmit()
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          value={speech.listening ? (value + (speech.interim ? ' ' + speech.interim : '')) : value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={speech.listening ? 'Listening…' : placeholder}
          disabled={disabled}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-50"
        />

        {speech.supported && (
          <button
            type="button"
            onClick={speech.toggle}
            disabled={disabled}
            title={speech.listening ? 'Stop recording' : 'Start recording'}
            className={`flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-40 ${
              speech.listening
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {speech.listening ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                <path d="M19 10a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V21H9v2h6v-2h-2v-2.06A9 9 0 0 0 21 10h-2z" />
              </svg>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          Send
        </button>
      </div>
      {speech.listening && speech.interim && (
        <p className="text-xs text-gray-400 italic px-1">{speech.interim}</p>
      )}
    </div>
  )
}
