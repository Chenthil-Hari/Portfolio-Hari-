import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let rafId: number

    const colors = ['rgba(59,130,246,', 'rgba(139,92,246,', 'rgba(6,182,212,']

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15, // Made drift slower (0.15 instead of 0.3)
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.2 + 0.4,   // Slightly smaller particles
      alpha: Math.random() * 0.25 + 0.05, // Fainter opacity
      color: colors[Math.floor(Math.random() * colors.length)],
    })

    // Reduced count from 60 to 20 for a cleaner look and better performance
    const particles: Particle[] = Array.from({ length: 20 }, createParticle)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.alpha})`
        ctx.fill()
      })

      // Removed connecting lines to prevent busy/overloaded visual appearance

      rafId = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize, { passive: true })
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [prefersReduced])

  if (prefersReduced) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
