import { FC, useContext } from "react"

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
  const { setStage, setChapter } = useContext(GameContext)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="mb-8 text-5xl text-yellow-400">Sonic</div>
      {/* <div className="text-3xl">Choose a chapter to play</div> */}
      {getChapters().map((chapter) => (
        <button
          key={chapter}
          className="badge bg-blue-950 p-8 text-3xl text-white"
          onClick={() => {
            setChapter(chapter)
            setStage("warmup")
          }}
        >
          {chapter}
        </button>
      ))}
      {/* <div className="flex items-center">
        <label className="mr-2 text-xl">Nehézség</label>
        <select className="select select-bordered w-full max-w-xs text-xl">
          <option selected>easy </option>
          <option>medium</option>
          <option>hard</option>
        </select>
      </div> */}
      {/* <div className="flex flex-col items-start gap-2">
        <label className="radio-label flex items-center">
          <input
            type="radio"
            name="radio-difficulty"
            className="radio mr-2"
            checked={difficulty === "easy"}
            onChange={() => setDifficulty("easy")}
          />
          easy
        </label>
        <label className="radio-label flex items-center">
          <input
            type="radio"
            name="radio-difficulty"
            className="radio mr-2"
            checked={difficulty === "medium"}
            onChange={() => setDifficulty("medium")}
          />
          medium
        </label>
        <label className="radio-label flex items-center">
          <input
            type="radio"
            name="radio-difficulty"
            className="radio mr-2"
            checked={difficulty === "hard"}
            onChange={() => setDifficulty("hard")}
          />
          hard
        </label>
      </div> */}
      <DifficultyControl />
    </div>
  )
}
