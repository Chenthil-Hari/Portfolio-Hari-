import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Activity } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────
type Direction = 'north' | 'south' | 'east' | 'west'
type LightState = 'green' | 'yellow' | 'red'

interface Lane {
  id: Direction
  label: string
  density: number // 0–100
  light: LightState
  timer: number
}

const DIRECTIONS: Direction[] = ['north', 'south', 'east', 'west']
const YELLOW_DURATION = 3
const BASE_GREEN = 8
const MAX_GREEN = 25

// Compute green time proportional to traffic density
function computeGreenTime(density: number): number {
  return Math.round(BASE_GREEN + (density / 100) * (MAX_GREEN - BASE_GREEN))
}

const dirEmoji: Record<Direction, string> = {
  north: '↑',
  south: '↓',
  east:  '→',
  west:  '←',
}

const dirColors: Record<Direction, string> = {
  north: 'blue',
  south: 'violet',
  east:  'cyan',
  west:  'amber',
}

// ─── Traffic Light SVG ───────────────────────────────────────────────
function TrafficLight({ state }: { state: LightState }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-black/40 rounded-xl p-2 border border-white/[0.08]">
      {(['red', 'yellow', 'green'] as LightState[]).map(s => (
        <motion.div
          key={s}
          className="w-5 h-5 rounded-full"
          animate={{
            backgroundColor: state === s
              ? s === 'red'    ? '#ef4444'
              : s === 'yellow' ? '#eab308'
              : '#22c55e'
              : '#1e293b',
            boxShadow: state === s
              ? s === 'red'    ? '0 0 12px #ef444488'
              : s === 'yellow' ? '0 0 12px #eab30888'
              : '0 0 12px #22c55e88'
              : 'none',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}

// ─── Intersection Visual ─────────────────────────────────────────────
function Intersection({ lanes }: { lanes: Lane[] }) {
  const getLight = (dir: Direction) => lanes.find(l => l.id === dir)!.light
  const getDensity = (dir: Direction) => lanes.find(l => l.id === dir)!.density

  const laneColor = (dir: Direction) => {
    const light = getLight(dir)
    return light === 'green' ? 'bg-green-500' : light === 'yellow' ? 'bg-yellow-500' : 'bg-red-500/40'
  }

  const vehicleCount = (dir: Direction) => Math.round(getDensity(dir) / 10)

  return (
    <div className="relative w-56 h-56 mx-auto flex-shrink-0">
      {/* Road background grid */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {/* Road blocks */}
        <div className="bg-bg-tertiary rounded-tl-xl" />
        <div className="bg-slate-700/50" />
        <div className="bg-bg-tertiary rounded-tr-xl" />
        <div className="bg-slate-700/50" />
        {/* Center intersection */}
        <div className="bg-slate-600/60 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-slate-400 text-xs font-mono">⬛</div>
          </div>
        </div>
        <div className="bg-slate-700/50" />
        <div className="bg-bg-tertiary rounded-bl-xl" />
        <div className="bg-slate-700/50" />
        <div className="bg-bg-tertiary rounded-br-xl" />
      </div>

      {/* Center dashed lane lines */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px border-l-2 border-dashed border-white/10 pointer-events-none" />
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px border-t-2 border-dashed border-white/10 pointer-events-none" />

      {/* North traffic light */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
        <TrafficLight state={getLight('north')} />
        <span className="text-[9px] font-mono text-slate-400">{vehicleCount('north')} 🚗</span>
      </div>

      {/* South traffic light */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center gap-0.5">
        <TrafficLight state={getLight('south')} />
        <span className="text-[9px] font-mono text-slate-400">{vehicleCount('south')} 🚗</span>
      </div>

      {/* West traffic light */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
        <TrafficLight state={getLight('west')} />
        <span className="text-[9px] font-mono text-slate-400">{vehicleCount('west')} 🚗</span>
      </div>

      {/* East traffic light */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-row-reverse items-center gap-0.5">
        <TrafficLight state={getLight('east')} />
        <span className="text-[9px] font-mono text-slate-400">{vehicleCount('east')} 🚗</span>
      </div>

      {/* Active lane flow indicator */}
      {DIRECTIONS.filter(d => getLight(d) === 'green').map(d => (
        <motion.div
          key={d}
          className="absolute"
          style={{
            top: d === 'north' ? '33%' : d === 'south' ? '50%' : '45%',
            left: d === 'west' ? '33%' : d === 'east' ? '50%' : '45%',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-green-400 text-base">{dirEmoji[d]}</span>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Main Simulator Component ────────────────────────────────────────
export default function TrafficSimulator() {
  const [running, setRunning] = useState(false)
  const [activeLane, setActiveLane] = useState<Direction>('north')
  const [phase, setPhase] = useState<'green' | 'yellow'>('green')
  const [timeLeft, setTimeLeft] = useState(computeGreenTime(50))
  const [totalCleared, setTotalCleared] = useState<Record<Direction, number>>({
    north: 0, south: 0, east: 0, west: 0
  })

  const [lanes, setLanes] = useState<Lane[]>([
    { id: 'north', label: 'North', density: 70, light: 'green',  timer: computeGreenTime(70) },
    { id: 'south', label: 'South', density: 40, light: 'red',    timer: computeGreenTime(40) },
    { id: 'east',  label: 'East',  density: 85, light: 'red',    timer: computeGreenTime(85) },
    { id: 'west',  label: 'West',  density: 20, light: 'red',    timer: computeGreenTime(20) },
  ])

  // Determine next lane by highest density (that isn't currently active)
  const getNextLane = useCallback((current: Direction, currentLanes: Lane[]): Direction => {
    const others = currentLanes.filter(l => l.id !== current)
    return others.reduce((max, l) => l.density > max.density ? l : max).id
  }, [])

  // Update light states based on activeLane and phase
  const applyLightStates = useCallback((active: Direction, currentPhase: 'green' | 'yellow', nextLane: Direction): Lane[] => {
    return DIRECTIONS.map(dir => {
      let light: LightState = 'red'
      if (dir === active) light = currentPhase === 'green' ? 'green' : 'yellow'
      return { ...lanes.find(l => l.id === dir)!, light }
    })
  }, [lanes])

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPhase(currentPhase => {
            if (currentPhase === 'green') {
              return 'yellow'
            } else {
              // Transition to next lane
              setLanes(currentLanes => {
                const next = getNextLane(activeLane, currentLanes)
                setActiveLane(next)
                const greenTime = computeGreenTime(currentLanes.find(l => l.id === next)!.density)

                // Track vehicles cleared
                setTotalCleared(prev => ({
                  ...prev,
                  [activeLane]: prev[activeLane] + Math.round(currentLanes.find(l => l.id === activeLane)!.density / 10)
                }))

                return currentLanes.map(l => ({
                  ...l,
                  light: l.id === next ? 'green' : 'red',
                  timer: l.id === next ? greenTime : computeGreenTime(l.density)
                }))
              })
              setTimeout(() => setTimeLeft(tl => {
                setLanes(cl => {
                  const active = cl.find(l => l.light === 'green')
                  if (active) setTimeLeft(computeGreenTime(active.density))
                  return cl
                })
                return tl
              }), 50)
              return 'green'
            }
          })
          return YELLOW_DURATION
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, activeLane, phase, getNextLane, lanes])

  const handleReset = () => {
    setRunning(false)
    setActiveLane('north')
    setPhase('green')
    const defaultDensities: Record<Direction, number> = { north: 70, south: 40, east: 85, west: 20 }
    setLanes(DIRECTIONS.map((d, i) => ({
      id: d,
      label: d.charAt(0).toUpperCase() + d.slice(1),
      density: defaultDensities[d],
      light: i === 0 ? 'green' : 'red',
      timer: computeGreenTime(defaultDensities[d])
    })))
    setTimeLeft(computeGreenTime(70))
    setTotalCleared({ north: 0, south: 0, east: 0, west: 0 })
  }

  const updateDensity = (id: Direction, value: number) => {
    setLanes(prev => prev.map(l => l.id === id ? {
      ...l,
      density: value,
      timer: computeGreenTime(value)
    } : l))
    if (id === activeLane && phase === 'green') {
      setTimeLeft(computeGreenTime(value))
    }
  }

  const activeLaneData = lanes.find(l => l.id === activeLane)!

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
            <Activity size={14} className="text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Live Traffic Simulator</h4>
            <p className="text-[10px] text-slate-500 font-mono">Density-based dynamic signal timing</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning(r => !r)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              running
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20'
                : 'bg-green-500/10 border border-green-500/20 text-green-300 hover:bg-green-500/20'
            }`}
          >
            {running ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Run</>}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main Grid: Intersection + Status */}
      <div className="flex flex-col sm:flex-row gap-5 items-center">
        {/* Intersection */}
        <Intersection lanes={lanes} />

        {/* Status Panel */}
        <div className="flex-1 w-full space-y-3">
          {/* Active Lane Status */}
          <div className={`p-3 rounded-xl border ${
            phase === 'green' ? 'bg-green-500/5 border-green-500/20' : 'bg-yellow-500/5 border-yellow-500/20'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-mono">Active Lane</span>
              <span className={`text-xs font-semibold ${phase === 'green' ? 'text-green-400' : 'text-yellow-400'}`}>
                {phase.toUpperCase()}
              </span>
            </div>
            <p className="text-white font-bold capitalize">{dirEmoji[activeLane]} {activeLane}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${phase === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`}
                  animate={{ width: `${(timeLeft / (phase === 'green' ? computeGreenTime(activeLaneData.density) : YELLOW_DURATION)) * 100}%` }}
                  transition={{ duration: 0.9, ease: 'linear' }}
                />
              </div>
              <span className="text-xs text-slate-400 font-mono w-8 text-right">{timeLeft}s</span>
            </div>
          </div>

          {/* Vehicles cleared tracker */}
          <div className="grid grid-cols-2 gap-2">
            {DIRECTIONS.map(dir => (
              <div key={dir} className="glass-card rounded-lg px-3 py-2 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 capitalize">{dirEmoji[dir]} {dir}</span>
                <span className="text-[10px] font-mono text-blue-300">{totalCleared[dir]} cleared</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Density Sliders */}
      <div className="space-y-3">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Adjust Traffic Density</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {lanes.map(lane => (
            <div key={lane.id} className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">
                  {dirEmoji[lane.id]} {lane.label}
                </span>
                <span className="text-xs font-mono text-blue-300">{lane.density}% density</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                value={lane.density}
                onChange={e => updateDensity(lane.id, parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full bg-white/[0.08] accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-600 font-mono">
                <span>Low</span>
                <span>Green: {computeGreenTime(lane.density)}s</span>
                <span>High</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info note */}
      <p className="text-[10px] text-slate-600 font-mono text-center border-t border-white/[0.04] pt-3">
        Algorithm: Green time = {BASE_GREEN}s base + (density% × {MAX_GREEN - BASE_GREEN}s bonus) · Priority assigned to highest density lane
      </p>
    </div>
  )
}
