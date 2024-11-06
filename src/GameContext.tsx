import { createContext, FC, PropsWithChildren, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

export const DIFFICULTIES = ["easy", "medium", "hard"] as const
type Difficulty = (typeof DIFFICULTIES)[number]

type GameContextType = {
  difficulty: Difficulty
  setDifficulty: (difficulty: Difficulty) => void
}

export const GameContext = createContext<GameContextType>({
  difficulty: "easy",
  setDifficulty: () => {},
})

// Create a provider that wraps the App component

export const GameProvider: FC<PropsWithChildren> = ({ children }) => {
  const [difficulty, setDifficulty] = useLocalStorage<Difficulty>("difficulty", "easy")

  return (
    <GameContext.Provider
      value={{
        difficulty,
        setDifficulty,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
