import { createContext, FC, PropsWithChildren, useState } from "react"

import { Chapter, getChapters } from "./levels"

type Stage = "lobby" | "warmup" | "play" | "result"

type Difficulty = "easy" | "medium" | "hard"
export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"]

type GameContextType = {
  stage: Stage
  level: Chapter
  difficulty: Difficulty
  setStage: (stage: Stage) => void
  setLevel: (level: Chapter) => void
  setDifficulty: (difficulty: Difficulty) => void
}

export const GameContext = createContext<GameContextType>({
  stage: "lobby",
  level: getChapters()[0]!,
  difficulty: "easy",
  setStage: () => {},
  setLevel: () => {},
  setDifficulty: () => {},
})

// Create a provider that wraps the App component

export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
  const [stage, setStage] = useState<Stage>("lobby")
  const [level, setLevel] = useState<Chapter>(getChapters()[0]!)
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")

  return (
    <GameContext.Provider
      value={{ stage, level, setStage, setLevel, difficulty, setDifficulty }}
    >
      {children}
    </GameContext.Provider>
  )
}
