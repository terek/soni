// import { CheckCircleIcon, CircleStackIcon } from "@heroicons/react/24/solid"

import classNames from "classnames"
import { FC, useContext, useMemo, useState } from "react"

import { GameContext } from "./GameContext"
import { Chapter, CHAPTER_DATA } from "./levels"

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

export const PlayPage: FC = () => {
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
