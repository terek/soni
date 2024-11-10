import { FC, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { GameContext } from "./GameContext"
import { getChapters } from "./levels"
import { Nav } from "./Nav"

const DifficultyControl = () => {
  const { difficulty, setDifficulty } = useContext(GameContext)
  return (
    <div>
      <input
        type="range"
        min={0}
        max={2}
        value={difficulty === "easy" ? 0 : difficulty === "medium" ? 1 : 2}
        className="range-tertiary range w-80"
        step="1"
        onChange={(value) => {
          const v = parseInt(value.target.value)
          setDifficulty(v === 0 ? "easy" : v === 1 ? "medium" : "hard")
        }}
      />
      <div className="flex w-full justify-between px-2 text-xl text-yellow-300">
        <span>easy</span>
        <span>medium</span>
        <span>hard</span>
      </div>
    </div>
  )
}

export const LobbyPage: FC = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Nav></Nav>
      {getChapters().map((chapter) => (
        <button
          key={chapter.id}
          className="badge min-w-[240px] bg-blue-950 p-8 text-2xl text-white"
          onClick={() => {
            navigate(`/play/${chapter.id}`)
          }}
        >
          {chapter.title}
        </button>
      ))}
      {false && <DifficultyControl />}
    </div>
  )
}
