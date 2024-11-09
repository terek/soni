import { FC, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { GameContext } from "./GameContext"
import { getChapters } from "./levels"

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
    <div className="flex h-dvh flex-col items-center justify-center gap-8">
      <div className="mb-8 text-5xl text-yellow-400">Sonic</div>
      {/* <div className="text-3xl">Choose a chapter to play</div> */}
      {getChapters().map((chapter) => (
        <button
          key={chapter.id}
          className="badge bg-blue-950 p-8 text-3xl text-white"
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
