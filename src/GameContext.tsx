import { createContext, FC, PropsWithChildren, useState } from "react"

import { getLevels, Level } from "./levels"

type Stage = "lobby" | "warmpu" | "play" | "result"

type GameContextType = {
  stage: Stage
  level: Level
  setStage: (stage: Stage) => void
  setLevel: (level: Level) => void
}

export const GameContext = createContext<GameContextType>({
  stage: "lobby",
  level: getLevels()[0]!,
  setStage: () => {},
  setLevel: () => {},
})

// Create a provider that wraps the App component

export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
  const [stage, setStage] = useState<Stage>("lobby")
  const [level, setLevel] = useState<Level>(getLevels()[0]!)

  return (
    <GameContext.Provider value={{ stage, level, setStage, setLevel }}>
      {children}
    </GameContext.Provider>
  )
}
