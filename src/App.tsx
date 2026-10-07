import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { ArcadeScreen } from './components/arcade/ArcadeScreen'
import { EndingScreen } from './components/ending/EndingScreen'
import { GameScreen } from './components/game/GameScreen'
import { GuideScreen } from './components/guide/GuideScreen'
import { SetupScreen } from './components/setup/SetupScreen'
import { TitleScreen } from './components/title/TitleScreen'
import { Toasts } from './components/ui/Toasts'
import { useGame } from './store/game'

export default function App() {
  const screen = useGame((s) => s.screen)
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="h-full"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {screen === 'title' && <TitleScreen />}
          {screen === 'setup' && <SetupScreen />}
          {screen === 'game' && <GameScreen />}
          {screen === 'ending' && <EndingScreen />}
          {screen === 'guide' && <GuideScreen />}
          {screen === 'arcade' && <ArcadeScreen />}
        </motion.div>
      </AnimatePresence>
      <Toasts />
    </MotionConfig>
  )
}
