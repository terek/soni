import { createContext, FC, PropsWithChildren, useState } from "react"

import { getLevels, Level } from "./levels"

type Stage = "lobby" | "warmup" | "play" | "result"

type Difficulty = "easy" | "medium" | "hard"
export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"]

type GameContextType = {
  stage: Stage
  level: Level
  difficulty: Difficulty
  setStage: (stage: Stage) => void
  setLevel: (level: Level) => void
  setDifficulty: (difficulty: Difficulty) => void
}

export const GameContext = createContext<GameContextType>({
  stage: "lobby",
  level: getLevels()[0]!,
  difficulty: "1",
  setStage: () => {},
  setLevel: () => {},
  setDifficulty: () => {},
})

// Create a provider that wraps the App component

export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
  const [stage, setStage] = useState<Stage>("lobby")
  const [level, setLevel] = useState<Level>(getLevels()[0]!)
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")

  return (
    <GameContext.Provider
      value={{ stage, level, setStage, setLevel, difficulty, setDifficulty }}
    >
      {children}
    </GameContext.Provider>
  )
}
