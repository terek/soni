import { createContext, FC, PropsWithChildren, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

import { Chapter, getChapters } from "./levels"

type Stage = "lobby" | "warmup" | "play" | "result"

type Difficulty = "easy" | "medium" | "hard"
export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"]

type GameContextType = {
  stage: Stage
  chapter: Chapter
  difficulty: Difficulty
  setStage: (stage: Stage) => void
  setChapter: (chapter: Chapter) => void
  setDifficulty: (difficulty: Difficulty) => void
}

export const GameContext = createContext<GameContextType>({
  stage: "lobby",
  chapter: getChapters()[0]!,
  difficulty: "easy",
  setStage: () => {},
  setChapter: () => {},
  setDifficulty: () => {},
})

// Create a provider that wraps the App component

export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
  const [stage, setStage] = useState<Stage>("lobby")
  const [chapter, setChapter] = useState<Chapter>(getChapters()[0]!)
  const [difficulty, setDifficulty] = useLocalStorage<Difficulty>("difficulty", "easy")

  return (
    <GameContext.Provider
      value={{ stage, chapter, setStage, setChapter, difficulty, setDifficulty }}
    >
      {children}
    </GameContext.Provider>
  )
}
