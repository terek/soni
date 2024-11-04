import { createContext, FC, PropsWithChildren, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

import { Chapter, getChapters } from "./levels"

export const PLAY_STAGES = ["warmup", "test"] as const
const STAGES = ["lobby", ...PLAY_STAGES, "result"] as const

export type PlayStage = (typeof PLAY_STAGES)[number]
export type Stage = (typeof STAGES)[number]

type TestState = "playing" | "answering" | "correct" | "wrong"

export const DIFFICULTIES = ["easy", "medium", "hard"] as const
type Difficulty = (typeof DIFFICULTIES)[number]

type GameContextType = {
  stage: Stage
  testState: TestState
  playingIndex: number | null
  chapter: Chapter
  difficulty: Difficulty
  setStage: (stage: Stage) => void
  setTestState: (testState: TestState) => void
  setPlayingIndex: (index: number | null) => void
  setChapter: (chapter: Chapter) => void
  setDifficulty: (difficulty: Difficulty) => void
}

export const GameContext = createContext<GameContextType>({
  stage: "lobby",
  testState: "playing",
  playingIndex: null,
  chapter: getChapters()[0]!,
  difficulty: "easy",
  setStage: () => {},
  setTestState: () => {},
  setPlayingIndex: () => {},
  setChapter: () => {},
  setDifficulty: () => {},
})

// Create a provider that wraps the App component

export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
  const [stage, setStage] = useState<Stage>("lobby")
  const [testState, setTestState] = useState<TestState>("playing")
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [chapter, setChapter] = useState<Chapter>(getChapters()[0]!)
  const [difficulty, setDifficulty] = useLocalStorage<Difficulty>("difficulty", "easy")

  return (
    <GameContext.Provider
      value={{
        stage,
        testState,
        playingIndex,
        chapter,
        setStage,
        setTestState,
        setPlayingIndex,
        setChapter,
        difficulty,
        setDifficulty,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
