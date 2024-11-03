import classNames from "classnames"
import { FC, StrictMode, useContext, useMemo, useState } from "react"

import { GameContext, GameProvider } from "./GameContext"
import { Chapter, CHAPTER_DATA, getChapters } from "./levels"

// import { CheckCircleIcon, CircleStackIcon } from "@heroicons/react/24/solid"

function ImageButton({
  chapter,
  index,
  selected,
  onClick,
}: {
  chapter: Chapter
  index: number
  selected: boolean
  onClick: () => void
}) {
  const indexStr = useMemo(() => index.toString().padStart(2, "0"), [index])
  return (
    <img
      className={classNames(
        "box-border rounded-xl border-4 bg-blue-900 text-3xl text-blue-200",
        {
          "border-red-500": selected,
          "border-transparent": !selected,
        },
      )}
      src={`tiles/${chapter}/${indexStr}.jpg`}
      onClick={onClick}
    />

    // <div
    //   className={classNames(
    //     "mask mask-squircle flex aspect-square items-center justify-center",
    //     "nunito-800 bg-rose-500 text-6xl text-white",
    //   )}
    //   onClick={() => onClick(value)}
    // >
    //   {value}
    // </div>
  )
}

function Board() {
  const { chapter } = useContext(GameContext)
  const chapterData = useMemo(() => CHAPTER_DATA[chapter], [chapter])
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null)
  const startPlaying = (index: number) => {
    if (currentPlaying !== null) {
      const id = chapterData.names[currentPlaying].id
      const audioElement = document.getElementById(`audio_${id}`)! as HTMLAudioElement
      audioElement.pause()
    }
    setCurrentPlaying(index)
    const id = chapterData.names[index].id
    const audioElement = document.getElementById(`audio_${id}`)! as HTMLAudioElement
    audioElement.play()
  }
  const endPlaying = (_index: number) => {
    setCurrentPlaying(null)
  }
  return (
    <div className="flex flex-col items-center justify-start bg-blue-800">
      <div
        className={classNames(
          "m-0",
          "portrait:w-full portrait:max-w-[40rem]",
          "landscape:h-full landscape:w-[40rem]",
          `grid place-items-stretch gap-2 ${chapterData.classNames}`,
        )}
      >
        {Array.from({ length: chapterData.numRows * chapterData.numCols }).map(
          (_, i) => (
            <div key={i}>
              <ImageButton
                chapter={chapter}
                index={i}
                selected={currentPlaying === i}
                onClick={() => startPlaying(i)}
              />
              <audio
                id={`audio_${chapterData.names[i].id}`}
                src={`sounds/${chapter}/${chapterData.names[i].id}.ogg`}
                onEnded={() => endPlaying(i)}
              />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

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

const LobbyPage: FC = ({}) => {
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

// const Timeline: FC = () => {
//   return (
//     <ul className="timeline w-full">
//       <li>
//         <div className="timeline-start w-24"></div>
//         <div className="timeline-middle">
//           <CheckCircleIcon className="size-12" />
//         </div>
//         <hr className="bg-primary" />
//       </li>
//       <li>
//         <hr className="bg-primary" />
//         <div className="timeline-start w-24"></div>
//         <div className="timeline-middle">
//           <CheckCircleIcon className="size-12" />
//         </div>
//         <hr className="bg-primary" />
//       </li>
//       <li>
//         <hr className="bg-primary" />
//         <div className="timeline-start w-24"></div>
//         <div className="timeline-middle">
//           <CircleStackIcon className="size-12" />
//         </div>
//         <hr />
//       </li>
//       <li>
//         <hr />
//         <div className="timeline-start w-24"></div>
//         <div className="timeline-middle">
//           <CircleStackIcon className="size-12" />
//         </div>
//         <hr />
//       </li>
//       <li>
//         <hr />
//         <div className="timeline-middle">
//           <CircleStackIcon className="size-12" />
//         </div>
//       </li>
//     </ul>
//   )
// }

const PlayPage: FC = () => {
  const { setStage } = useContext(GameContext)
  return (
    <>
      {/* <div className="absolute inset-x-0 top-4 flex flex-col items-center">
        <button
          className="badge bg-blue-950 p-4 text-white"
          onClick={() => setStage("result")}
        >
          Chapter 1
        </button>
      </div> */}
      <div
        className={classNames(
          "flex h-full gap-4",
          "items-center justify-center portrait:flex-col",
        )}
      >
        <Board />
        <div className="flex items-center justify-center">
          {/* {stage === "warmup" &&
            DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                className="badge bg-blue-950 p-8 text-3xl text-white"
                onClick={() => {
                  setStage("play")
                  setDifficulty(difficulty)
                }}
              >
                {difficulty}
              </button>
            ))}
          {stage === "play" && (
            <>
              <Timeline />
            </>
          )} */}
          <button
            className="badge bg-blue-950 p-8 text-3xl text-white"
            onClick={() => setStage("lobby")}
          >
            Vissza!
          </button>
        </div>
      </div>
    </>
  )
}

const ResultPage: FC = () => {
  const { setStage } = useContext(GameContext)
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl">Congratulations!</div>
        <div className="text-3xl">You have completed the game</div>
        <div className="flex">
          <div className="avatar">
            <div className="w-24 rounded-full object-scale-down">
              <img src="g/01.png" alt="avatar" />
            </div>
          </div>
          <div className="w-24 rounded bg-clip-border">
            <img
              className="size-24 object-contain"
              width="20px"
              height={20}
              src="g/02.png"
              alt="avatar"
            />
          </div>
        </div>

        <button onClick={() => setStage("lobby")} className="btn-blue btn">
          Restart
        </button>
      </div>
    </>
  )
}

const Screen: FC<{}> = () => {
  const { stage } = useContext(GameContext)

  return (
    <>
      {stage === "lobby" && <LobbyPage />}
      {["warmup", "play"].includes(stage) && <PlayPage />}
      {stage === "result" && <ResultPage />}
    </>
  )
}

function App() {
  return (
    <>
      <StrictMode>
        <div className="h-screen bg-blue-800 text-gray-900">
          <GameProvider>
            <Screen />
          </GameProvider>
        </div>
      </StrictMode>
    </>
  )
}

export default App
