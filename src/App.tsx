import classNames from "classnames"
import { FC, StrictMode, useContext, useMemo, useState } from "react"

import { GameContext, GameProvider } from "./GameContext"
import {
  getLevels,
  Level,
  LEVEL_DATA,
} from "./levels"


function ImageButton({
  level,
  index,
  selected,
  onClick,
}: {
  level: Level
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
      src={`tiles/${level}/${indexStr}.jpg`}
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
  const { level } = useContext(GameContext)
  const levelData = useMemo(() => LEVEL_DATA[level], [level])
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null)
  const startPlaying = (index: number) => {
    if (currentPlaying !== null) {
      const id = levelData.names[currentPlaying].id
      const audioElement = document.getElementById(`audio_${id}`)! as HTMLAudioElement
      audioElement.pause()
    }
    setCurrentPlaying(index)
    const id = levelData.names[index].id
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
          `grid place-items-stretch gap-2 ${levelData.classNames}`,
        )}
      >
        {Array.from({ length: levelData.numRows * levelData.numCols }).map((_, i) => (
          <div key={i}>
            <ImageButton
              level={level}
              index={i}
              selected={currentPlaying === i}
              onClick={() => startPlaying(i)}
            />
            <audio
              id={`audio_${levelData.names[i].id}`}
              src={`sounds/${level}/${levelData.names[i].id}.ogg`}
              onEnded={() => endPlaying(i)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const LobbyPage: FC = ({}) => {
  const { setStage, setLevel } = useContext(GameContext)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="mb-8 text-5xl text-yellow-400">Sonic</div>
      {/* <div className="text-3xl">Choose a level to play</div> */}
      {getLevels().map((level) => (
        <button
          key={level}
          className="badge bg-blue-950 p-8 text-3xl text-white"
          onClick={() => {
            setLevel(level)
            setStage("play")
          }}
        >
          {level}
        </button>
      ))}
    </div>
  )
}

const PlayPage: FC = () => {
  const { setStage } = useContext(GameContext)
  return (
    <>
      {/* <div className="absolute inset-x-0 top-4 flex flex-col items-center">
        <button
          className="badge bg-blue-950 p-4 text-white"
          onClick={() => setStage("result")}
        >
          Level 1
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
