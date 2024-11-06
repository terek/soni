// import { CheckCircleIcon, CircleStackIcon } from "@heroicons/react/24/solid"

import classNames from "classnames"
import { motion } from "framer-motion"
import { FC, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Chapter, CHAPTER_DATA } from "./levels"

import {
  PaperAirplaneIcon,
  PlayCircleIcon,
  RocketLaunchIcon,
  SunIcon,
} from "@heroicons/react/24/solid"

type BorderState = "selected" | "correct" | "wrong" | null

function Card({
  chapter,
  imageId,
  borderState,
  onClick,
}: {
  chapter: Chapter
  imageId: number
  borderState: BorderState
  onClick: () => void
}) {
  const indexStr = useMemo(() => imageId.toString().padStart(2, "0"), [imageId])
  return (
    <motion.img
      whileTap={{
        scale: 0.8,
        rotate: -30,
        borderRadius: "100%",
      }}
      className={classNames(
        "box-border rounded-xl border-4 text-3xl text-blue-200 shadow-xl",
        {
          "border-blue-500": borderState === "selected",
          "border-red-500": borderState === "wrong",
          "border-green-500": borderState === "correct",
          "border-transparent": borderState === null,
        },
      )}
      src={`/tiles/${chapter}/${indexStr}.jpg`}
      onClick={onClick}
    />
  )
}

const TestStateIndicator: FC = () => {
  // const { testState } = useContext(GameContext)'
  const testState = "playing"
  return (
    <div>
      <img
        className={classNames("h-20", { invisible: testState !== "playing" })}
        src="/listening.png"
        alt="Listen"
      />
    </div>
  )
}

type Mode = "warmup" | "try" | "test"

const BottomNavigation: FC<{
  disabled: boolean
  mode: Mode
  onModeChanged: (mode: Mode) => void
}> = ({ disabled, mode, onModeChanged }) => {
  const ACTIVE_CLASSES = "active bg-primary text-white"
  return (
    <div className="btm-nav">
      <button
        disabled={disabled}
        className={classNames(mode === "warmup" ? ACTIVE_CLASSES : "bg-blue-100")}
        onClick={() => onModeChanged("warmup")}
      >
        <SunIcon className="size-6" />
        <span className="btm-nav-label">Get</span>
      </button>
      <button
        disabled={disabled}
        className={classNames(mode === "try" ? ACTIVE_CLASSES : "bg-blue-100")}
        onClick={() => onModeChanged("try")}
      >
        <PaperAirplaneIcon className="size-6" />
        <span className="btm-nav-label">Set</span>
      </button>
      <button
        disabled={disabled}
        className={classNames(mode === "test" ? ACTIVE_CLASSES : "bg-blue-100")}
        onClick={() => onModeChanged("test")}
      >
        <RocketLaunchIcon className="size-6" />
        <span className="btm-nav-label">Go!</span>
      </button>
    </div>
  )
}

export const PlayPage: FC = () => {
  const navigate = useNavigate()
  const params = useParams<{ chapter: string; mode: string }>()
  const [navigationDisabled, setNavigationDisabled] = useState(false)

  // TODO: Get rid of chapter from GameContext.
  // const { chapter } = useContext(GameContext)

  // if (!params.chapter || !Object.keys(CHAPTER_DATA).includes(params.chapter)) {
  //   return <div>Invalid page</div>
  // }
  const startPlaying = (index: number) => {
    const id = chapterData.names[index].id
    const audioElement = document.getElementById(`audio_${id}`)! as HTMLAudioElement
    audioElement.play()
  }

  const stopPlaying = (index: number) => {
    const id = chapterData.names[index].id
    const audioElement = document.getElementById(`audio_${id}`)! as HTMLAudioElement
    audioElement.pause()
    audioElement.currentTime = 0
  }

  const chapter = params.chapter as Chapter
  const mode = params.mode as Mode
  const chapterData = useMemo(() => CHAPTER_DATA[chapter], [chapter])

  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null)

  type TestState = "playing" | "answering" | "correct" | "wrong"

  // const [playingIndex, setPlayingIndex] = useState<number | null>(null)

  // const runSingleTest = () => {
  //   setPlayStage("test")
  //   setPlayingIndex(null)
  //   setTestState("playing")
  //   // pick a random index
  //   // const index = Math.floor(Math.random() * chapterData.names.length)
  //   const index = 1
  //   const id = chapterData.names[index].id
  //   const audioElement = document.getElementById(`audio_${id}`)! as HTMLAudioElement
  //   audioElement.play()
  //   audioElement.onended = () => {
  //     console.log("ended")
  //     // setTestState("answering")
  //     setPlayStage("warmup")
  //   }
  // }

  // Warmup, Try and Test logic
  // In warmup, the user can listen to the audio by clicking on the card
  // In try, the user hears the audio and then has to select the correct card
  // In test, the user listens to multiple series of audio and has to select the cards
  // in the correct order in each step.

  // const [selectedIndex, _setSelectedIndex] = useState<number | null>(null)
  const [tryPlayedIndex, setTryPlayedIndex] = useState<number | null>(null)
  const [tryPickedIndex, setTryPickedIndex] = useState<number | null>(null)

  const onCardClicked = (index: number) => {
    if (currentPlaying !== null) {
      stopPlaying(currentPlaying)
      onEndPlaying(currentPlaying)
    }
    if (mode === "warmup") {
      setNavigationDisabled(true)
      setCurrentPlaying(index)
      startPlaying(index)
    } else if (mode === "try") {
      if (tryPlayedIndex !== null && tryPickedIndex === null) {
        setNavigationDisabled(false)
        setTryPickedIndex(index)
      }
    } else if (mode === "test") {
    }
  }

  const startTry = () => {
    setNavigationDisabled(true)
    // Pick a random index
    const index = Math.floor(Math.random() * chapterData.names.length)
    setTryPlayedIndex(index)
    setTryPickedIndex(null)
    setCurrentPlaying(index)
    startPlaying(index)
  }

  const onEndPlaying = (index: number) => {
    setNavigationDisabled(false)
    setCurrentPlaying(null)
    if (mode === "try") {
      setTryPlayedIndex(index)
    }
  }

  const borderState = (index: number): BorderState => {
    if (mode === "warmup") {
      return currentPlaying === index ? "selected" : null
    }
    if (mode === "try") {
      if (tryPickedIndex === null) {
        return null
      }
      if (tryPickedIndex === index) {
        return tryPlayedIndex === index ? "correct" : "wrong"
      }
      if (tryPlayedIndex === index) {
        return "correct"
      }
      return null
    }
    return null
  }

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
      <div>
        {chapterData.names.map((audioId, index) => (
          <audio
            key={audioId.id}
            id={`audio_${audioId.id}`}
            src={`/sounds/${chapter}/${audioId.id}.ogg`}
            onEnded={() => onEndPlaying(index)}
          />
        ))}
      </div>
      <div
        className={classNames(
          "grid h-full grid-cols-1 grid-rows-[auto_1fr_auto_auto]",
          "items-center justify-center portrait:flex-col",
        )}
      >
        <div className="h-8 w-full bg-green-800"></div>
        {/* Controls */}
        <div className="flex items-center justify-between px-2 py-2">
          {mode == "try" &&
            currentPlaying === null &&
            (tryPlayedIndex === null) == (tryPickedIndex === null) && (
              <div className="flex w-full items-center justify-center">
                <button
                  onClick={() => {
                    startTry()
                  }}
                >
                  <PlayCircleIcon className="size-48 rounded-full border-2 border-black bg-black text-yellow-500 blur-none drop-shadow-xl" />
                </button>
              </div>
            )}
        </div>
        {/* Board */}
        <div className="relative mb-16 flex flex-col items-center justify-start">
          <div
            className={classNames(
              "m-0 overflow-clip px-2 py-2",
              "portrait:w-full portrait:max-w-[40rem]",
              "landscape:h-full landscape:w-[40rem]",
              `grid place-items-stretch gap-2 ${chapterData.classNames}`,
              { "blur-sm": mode === "try" && tryPlayedIndex === null },
            )}
          >
            {chapterData.names.map((_, index) => (
              <div key={index}>
                <Card
                  chapter={chapter}
                  imageId={index}
                  borderState={borderState(index)}
                  onClick={() => onCardClicked(index)}
                />
              </div>
            ))}
          </div>
        </div>

        <BottomNavigation
          disabled={navigationDisabled}
          mode={mode}
          onModeChanged={(mode: Mode) =>
            navigate(`/play/${chapter}/${mode}`, { replace: true })
          }
        />
      </div>
    </>
  )
}
