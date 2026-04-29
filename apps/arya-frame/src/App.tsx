import { useEffect, useState, useCallback, useRef } from 'react'
import sdk, { type FrameContext } from '@farcaster/frame-sdk'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, ShoppingCart, Package, Shield, Sword, 
  Terminal, BarChart3, MessageCircle, Info, ChevronRight,
  Target, Users, Zap, Search, Settings, ArrowLeft, RefreshCw,
  Skull, AlertCircle, TrendingUp, DollarSign, Brain
} from 'lucide-react'
import { EmergentBrain } from './components/EmergentBrain'

// ── Types & Constants ────────────────────────────────────────────────────────
type Screen = 'onboarding' | 'home' | 'pick' | 'hurl' | 'execution' | 'store' | 'inventory' | 'chat' | 'api' | 'intel' | 'admin' | 'cortex'
type ItemType = 'weapon' | 'shield' | 'special'
type Weapon = { id: string; name: string; icon: string; cost: number; type: ItemType; description: string }

interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  followerCount: number
  bio?: string
}

const WEAPONS: Weapon[] = [
  { id: 'tomato', name: 'Rotten Tomato', icon: '🍅', cost: 0, type: 'weapon', description: 'Basic projectile. Smelly but harmless.' },
  { id: 'cabbage', name: 'Cabbage', icon: '🥬', cost: 50, type: 'weapon', description: 'Dense and leafy. Decent impact.' },
  { id: 'egg', name: 'Rotten Egg', icon: '🥚', cost: 100, type: 'weapon', description: 'Double damage if it hits the face.' },
  { id: 'poop', name: 'Cartoon Poop', icon: '💩', cost: 250, type: 'weapon', description: 'Ultimate shame. Stays on PFP for 1hr.' },
  { id: 'watermelon', name: 'Watermelon', icon: '🍉', cost: 500, type: 'weapon', description: 'Heavy artillery. Breaks most basic shields.' },
  { id: 'wildfire', name: 'Wildfire Flask', icon: '🧪', cost: 1000, type: 'weapon', description: 'Burn the block. Ignore all shields.' },
  { id: 'basic_shield', name: 'Iron Buckler', icon: '🛡️', cost: 300, type: 'shield', description: 'Deflects 1 small fruit.' },
  { id: 'great_shield', name: 'Wall Shield', icon: '🏰', cost: 1200, type: 'shield', description: 'Full protection against heavy fruit.' },
  { id: 'valyrian_steel', name: 'Valyrian Steel', icon: '⚔️', cost: 5000, type: 'weapon', description: 'The sharpest blade. One strike is all it takes.' },
]

const FALLBACK_TARGETS: FarcasterUser[] = [
  { fid: 3, username: 'dwr', displayName: 'Dan Romero', pfpUrl: 'https://i.imgur.com/76S9vI0.jpg', followerCount: 150000, bio: 'Farcaster Founder' },
  { fid: 2, username: 'v', displayName: 'Vitalik Buterin', pfpUrl: 'https://i.imgur.com/2X8pBvI.png', followerCount: 500000, bio: 'Ethereum' },
  { fid: 1214, username: 'jessepollak', displayName: 'Jesse Pollak', pfpUrl: 'https://i.imgur.com/8QpXQpI.jpg', followerCount: 80000, bio: 'Base' },
]

// ── Components ───────────────────────────────────────────────────────────────

const GlassCard = ({ children, style = {} }: any) => (
  <div style={{ ...styles.glass, ...style }}>{children}</div>
)

const NavButton = ({ icon, active, onClick, label }: any) => (
  <button onClick={onClick} style={styles.navButton(active)}>
    {icon}
    <span>{label}</span>
  </button>
)

export default function App() {
  const [ctx, setCtx] = useState<FrameContext | null>(null)
  const [screen, setScreen] = useState<Screen>('home')
  const [nextScreen, setNextScreen] = useState<Screen>('hurl')
  const [weapon, setWeapon] = useState<Weapon>(WEAPONS[0])
  const [targetUser, setTargetUser] = useState<FarcasterUser | null>(null)
  const [status, setStatus] = useState('')
  const [balance, setBalance] = useState(1000)
  const [inventory, setInventory] = useState<string[]>(['tomato'])
  const [ownedShields, setOwnedShields] = useState<string[]>([])
  const [power, setPower] = useState(0)
  const [isCharging, setIsCharging] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [candidates, setCandidates] = useState<FarcasterUser[]>(FALLBACK_TARGETS)
  const [searching, setSearching] = useState(false)
  const [intel, setIntel] = useState<any>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [velocity, setVelocity] = useState(0.5)

  useEffect(() => {
    const interval = setInterval(() => {
      setVelocity(v => {
        const next = v + (Math.random() - 0.5) * 0.1
        return Math.max(0.1, Math.min(1.0, next))
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // ── Logic ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setCtx(await sdk.context)
      await sdk.actions.ready()
    }
    load()
  }, [])

  useEffect(() => {
    let interval: any
    if (isCharging) {
      interval = setInterval(() => {
        setPower(p => (p >= 100 ? 0 : p + 5))
      }, 30)
    }
    return () => clearInterval(interval)
  }, [isCharging])

  const buyItem = (item: Weapon) => {
    if (balance >= item.cost) {
      setBalance(b => b - item.cost)
      if (item.type === 'shield') setOwnedShields(s => [...s, item.id])
      else setInventory(i => [...i, item.id])
      setStatus(`Bought ${item.icon} ${item.name}!`)
    } else {
      setStatus('Insufficient $ARYA balance.')
    }
  }

  // ── Screens ────────────────────────────────────────────────────────────────

  const HomeScreen = () => (
    <div style={styles.screenContainer}>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
        <img src="https://i.imgur.com/8m5XN0h.png" alt="Arya" style={styles.heroAvatar} />
        <h1 style={styles.h1}>Arya Engine</h1>
        <p style={styles.sub}>The Iron Tax. The Black List. The Sovereign End.</p>
      </motion.div>

      <div style={styles.statsRow}>
        <GlassCard style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: '#888' }}>BALANCE</p>
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#0ff' }}>{balance} $ARYA</p>
        </GlassCard>
        <GlassCard style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: '#888' }}>ACTIVE TARGET</p>
          <p style={{ fontSize: '18px', fontWeight: 800 }}>{targetUser ? `@${targetUser.username}` : 'None'}</p>
        </GlassCard>
      </div>

      <div style={styles.menuGrid}>
        <button style={styles.menuItem} onClick={() => { setNextScreen('hurl'); setScreen('pick') }}>
          <Target size={24} color="#7b61ff" />
          <span>Walk of Shame</span>
        </button>
        <button style={styles.menuItem} onClick={() => { setNextScreen('execution'); setScreen('pick') }}>
          <Skull size={24} color="#ff003c" />
          <span>The Block</span>
        </button>
        <button style={styles.menuItem} onClick={() => setScreen('intel')}>
          <TrendingUp size={24} color="#00ff66" />
          <span>Intel</span>
        </button>
        <button style={styles.menuItem} onClick={() => setScreen('api')}>
          <Terminal size={24} color="#00d2ff" />
          <span>API / SDK</span>
        </button>
      </div>
    </div>
  )

  const StoreScreen = () => (
    <div style={styles.screenContainer}>
      <h2 style={styles.h2}><ShoppingCart size={20} /> Dark Market</h2>
      <div style={styles.grid2}>
        {WEAPONS.map(w => (
          <GlassCard key={w.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '24px' }}>{w.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>{w.name}</div>
            <div style={{ fontSize: '10px', color: '#aaa', minHeight: '30px' }}>{w.description}</div>
            <button 
              style={{ ...styles.buyBtn, opacity: balance < w.cost ? 0.5 : 1 }}
              onClick={() => buyItem(w)}
              disabled={balance < w.cost}
            >
              {w.cost} $ARYA
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  )

  const TargetPickerScreen = () => (
    <div style={styles.screenContainer}>
      <h2 style={styles.h2}><Users size={20} color="#7b61ff" /> Browse Targets</h2>
      <div style={styles.searchWrap}>
        <Search size={18} style={{ marginLeft: '12px', color: '#666' }} />
        <input 
          style={styles.searchInput} 
          placeholder="Search by name or @handle..." 
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
        />
      </div>
      <div style={styles.scrollList}>
        {candidates.map(u => (
          <div key={u.fid} style={styles.userCard}>
            <div style={styles.userPfpContainer}>
              <img src={u.pfpUrl} style={styles.userPfp} />
              <div style={styles.userPfpOverlay} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>{u.displayName}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>@{u.username}</div>
              <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>{(u.followerCount/1000).toFixed(1)}k followers</div>
            </div>
            <button style={styles.selectBtn} onClick={() => { setTargetUser(u); setScreen(nextScreen) }}>
              {nextScreen === 'execution' ? '🗡️ EXECUTE' : '💩 HURL'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const ApiDocsScreen = () => (
    <div style={styles.screenContainer}>
      <h2 style={styles.h2}><Terminal size={20} color="#00d2ff" /> Agent Intelligence</h2>
      <GlassCard>
        <p style={{ fontSize: '12px', fontWeight: 800, color: '#7b61ff', marginBottom: '10px' }}>MEMORY ARCHITECTURE (ALPHA)</p>
        <div style={styles.docItem}>
          <div style={styles.docIcon}><RefreshCw size={14} /></div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>Persistent Black List (RAG)</div>
            <p style={{ fontSize: '11px', color: '#888' }}>Using Google File Search Store for infinite, free persistent target memory.</p>
          </div>
        </div>
        <div style={styles.docItem}>
          <div style={styles.docIcon}><Zap size={14} /></div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>LangGraph State Checkpoints</div>
            <p style={{ fontSize: '11px', color: '#888' }}>Every interaction is checkpointed via SQLite for session-aware agent personality.</p>
          </div>
        </div>
      </GlassCard>
      
      <GlassCard>
        <p style={{ fontSize: '12px', fontWeight: 800, color: '#00ff66', marginBottom: '10px' }}>CLI ACCESS</p>
        <pre style={styles.codeBlock}>
          npx @dreamnet/arya hurl @jesse --power 80
        </pre>
      </GlassCard>
    </div>
  )

  const ExecutionScreen = () => (
    <div style={{ ...styles.screenContainer, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <motion.div 
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        style={styles.executionScene}
      >
        <div style={styles.executionBeam} />
        {targetUser && (
          <div style={styles.blockWrap}>
            <motion.img 
              src={targetUser.pfpUrl} 
              style={styles.blockPfp}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <div style={styles.blockWood} />
          </div>
        )}
        <motion.div 
          style={styles.blade}
          animate={{ y: isBusy ? 150 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>
      <button 
        style={{ ...styles.fireBtn, width: '100%', marginTop: '20px' }}
        onClick={() => {
          setIsBusy(true)
          setTimeout(() => {
            setStatus(`VALAR MORGHULIS. @${targetUser?.username} has been executed.`)
            setIsBusy(false)
          }, 800)
        }}
      >
        {isBusy ? 'BLADE FALLING...' : 'DROP THE BLADE'}
      </button>
      {status && <div style={{ ...styles.statusToast, background: 'rgba(255,0,60,0.8)' }}>{status}</div>}
    </div>
  )

  // ── Render Logic ───────────────────────────────────────────────────────────

  return (
    <div style={styles.root}>
        {screen === 'cortex' && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#000' }}>
            <button 
              onClick={() => setScreen('intel')}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 1100,
                background: 'rgba(255,0,85,0.2)',
                border: '1px solid #ff0055',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 800,
                backdropFilter: 'blur(10px)'
              }}
            >
              <ArrowLeft size={16} style={{ marginRight: '8px' }} />
              EXIT CORTEX
            </button>
            <EmergentBrain velocity={velocity} />
          </div>
        )}

      <div style={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {screen === 'home' && <HomeScreen />}
            {screen === 'store' && <StoreScreen />}
            {screen === 'pick' && <TargetPickerScreen />}
            {screen === 'hurl' && <HurlScreen />}
            {screen === 'execution' && <ExecutionScreen />}
            {screen === 'intel' && <IntelScreen intel={intel} setScreen={setScreen} />}
            {screen === 'api' && <ApiDocsScreen />}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav style={styles.navbar}>
        <NavButton icon={<Home size={20} />} label="Home" active={screen === 'home'} onClick={() => setScreen('home')} />
        <NavButton icon={<ShoppingCart size={20} />} label="Store" active={screen === 'store'} onClick={() => setScreen('store')} />
        <NavButton icon={<Target size={20} />} label="Target" active={['pick', 'hurl'].includes(screen)} onClick={() => setScreen('pick')} />
        <NavButton icon={<Package size={20} />} label="Bag" active={screen === 'inventory'} onClick={() => setScreen('inventory')} />
        <NavButton icon={<Brain size={20} />} label="Intel" active={['intel', 'cortex'].includes(screen)} onClick={() => setScreen('intel')} />
      </nav>
    </div>
  )
}

// ── Intel Screen ──────────────────────────────────────────────────────────────
const IntelScreen = ({ intel, setScreen }: any) => (
  <div style={styles.screenContainer}>
    <h2 style={styles.h2}><TrendingUp size={20} /> Sovereign Intel</h2>
    <GlassCard style={{ marginBottom: '16px' }}>
      <p style={{ fontSize: '12px', fontWeight: 800, color: '#7b61ff' }}>TOP MOVERS</p>
      {/* Mock intel rows */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
        <span>₿ Bitcoin</span>
        <span style={{ color: '#00ff66' }}>+2.4%</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
        <span>Ξ Ethereum</span>
        <span style={{ color: '#ff003c' }}>-0.8%</span>
      </div>
    </GlassCard>
    <GlassCard style={{ background: 'linear-gradient(135deg, rgba(255,0,85,0.1) 0%, rgba(0,210,255,0.1) 100%)', border: '1px solid #ff005544' }}>
      <p style={{ fontSize: '12px', fontWeight: 800, color: '#00d2ff' }}>NEURAL CORTEX</p>
      <p style={{ fontSize: '11px', color: '#ccc', marginBottom: '16px' }}>Visualize the 17,900 agents in real-time synaptic space.</p>
      <button 
        onClick={() => setScreen('cortex')}
        style={{
          width: '100%',
          padding: '12px',
          background: '#ff0055',
          border: 'none',
          borderRadius: '12px',
          color: '#fff',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <Zap size={16} /> ENTER CORTEX
      </button>
    </GlassCard>
  </div>
)

// ── Styles ───────────────────────────────────────────────────────────────────
const styles: any = {
  root: {
    height: '100vh',
    width: '100%',
    background: 'radial-gradient(circle at top right, #1a1a2e, #0f0c29)',
    color: '#fff',
    fontFamily: '"Inter", sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    paddingBottom: '90px',
  },
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80px',
    background: 'rgba(15, 12, 41, 0.9)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '0 10px',
    zIndex: 1000,
  },
  navButton: (active: boolean) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    color: active ? '#7b61ff' : '#666',
    transition: 'all 0.3s ease',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: active ? 700 : 400,
    transform: active ? 'scale(1.1)' : 'scale(1)',
  }),
  h1: { fontSize: '24px', fontWeight: 900, margin: '10px 0', letterSpacing: '-1px' },
  h2: { fontSize: '18px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' },
  sub: { fontSize: '13px', color: '#888', margin: 0 },
  heroAvatar: { width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px', border: '2px solid #7b61ff' },
  statsRow: { display: 'flex', gap: '12px' },
  menuGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  menuItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  buyBtn: {
    background: '#7b61ff',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    padding: '8px',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  yardContainer: { height: '300px', position: 'relative', borderRadius: '20px', overflow: 'hidden' },
  yardBackground: { height: '100%', background: '#2c3e50', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '40px' },
  shamePost: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  postWood: { width: '10px', height: '100px', background: '#3d2b1f', borderRadius: '4px' },
  targetAvatar: { width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #fff', position: 'absolute', top: '-40px' },
  hurlControls: { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  powerBarWrap: { height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', position: 'relative', overflow: 'hidden' },
  powerBarFill: { height: '100%', background: 'linear-gradient(90deg, #4CAF50, #FF5722)' },
  powerLabel: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, textAlign: 'center', fontSize: '10px', lineHeight: '24px', fontWeight: 800 },
  fireBtn: { height: '50px', borderRadius: '12px', background: '#ff003c', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' },
  statusToast: { background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '8px', fontSize: '12px', textAlign: 'center' },
  searchWrap: { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' },
  searchInput: { flex: 1, background: 'none', border: 'none', color: '#fff', padding: '12px', outline: 'none', fontSize: '14px' },
  scrollList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  userCard: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' },
  userPfpContainer: { position: 'relative', width: '44px', height: '44px' },
  userPfp: { width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' as const },
  userPfpOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' },
  selectBtn: { padding: '8px 16px', background: 'linear-gradient(135deg, #7b61ff, #5033ff)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' },
  docItem: { display: 'flex', gap: '12px', marginBottom: '12px' },
  docIcon: { width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7b61ff' },
  codeBlock: { background: '#000', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#00ff66', fontFamily: 'monospace', overflowX: 'auto' as const },
  executionScene: { width: '100%', height: '300px', background: '#000', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '2px solid #ff003c' },
  executionBeam: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: '100%', background: 'linear-gradient(to bottom, transparent, #ff003c, transparent)', opacity: 0.3 },
  blockWrap: { position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  blockWood: { width: '120px', height: '40px', background: '#2d1b0d', borderRadius: '8px 8px 0 0', border: '1px solid #3d2b1f' },
  blockPfp: { width: '80px', height: '80px', borderRadius: '10px', marginBottom: '-20px', zIndex: 1, border: '4px solid #2d1b0d' },
  blade: { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '140px', height: '10px', background: 'linear-gradient(to bottom, #888, #eee, #444)', borderRadius: '2px', boxShadow: '0 0 20px rgba(255,0,60,0.5)' }
}
