import React from 'react'

export const StorySection: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  return (
    <section className="relative min-h-screen px-4 py-16 flex flex-col items-center justify-center paper-texture">
      <div className="max-w-2xl text-center">
        <h2 className="text-4xl md:text-5xl font-display text-ink mb-8">
          {title}
        </h2>
        <p className="text-lg text-ink opacity-70 leading-relaxed font-serif">
          {content}
        </p>
      </div>
    </section>
  )
}

export default StorySection
