// import { CheckCircleIcon, CircleStackIcon } from "@heroicons/react/24/solid"

import { ISourceOptions } from "@tsparticles/engine"
import { loadConfettiPreset } from "@tsparticles/preset-confetti"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import classNames from "classnames"
import { motion } from "framer-motion"
import { BrainCircuit, Ear, RotateCcw, Target, Trophy } from "lucide-react"
import { FC, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Chapter, CHAPTER_DATA } from "./levels"

import {
  // PaperAirplaneIcon,
  PlayCircleIcon,
  // RocketLaunchIcon,
  // SunIcon,
} from "@heroicons/react/24/solid"

type BorderState = "selected" | "correct" | "wrong" | null

function Card({
  disabled,
  chapter,
  imageId,
  title,
  borderState,
  onClick,
}: {
  disabled: boolean
  chapter: Chapter
  imageId: number
  title: string
  borderState: BorderState
  onClick: () => void
}) {
  const indexStr = useMemo(() => imageId.toString().padStart(2, "0"), [imageId])
  return (
    <motion.button
      disabled={disabled}
      whileTap={
        disabled
          ? {}
          : {
              scale: 0.9,
              rotate: -5,
            }
      }
      className={classNames(
        "h-full w-full rounded-xl object-cover",

        "box-border rounded-xl border-8",
        {
          "shadow-xl": !disabled,
          "border-blue-500": borderState === "selected",
          "border-red-500": borderState === "wrong",
          "border-green-500": borderState === "correct",
          "border-transparent": borderState === null,
        },
      )}
      onClick={onClick}
    >
      <img className="" src={`/tiles/${chapter}/${indexStr}.jpg`} alt={title} />
      <span className="text-xs">{title}</span>
    </motion.button>
  )
}

// const TestStateIndicator: FC = () => {
//   // const { testState } = useContext(GameContext)'
//   const testState = "playing"
//   return (
//     <div>
//       <img
//         className={classNames("h-20", { invisible: testState !== "playing" })}
//         src="/listening.png"
//         alt="Listen"
//       />
//     </div>
//   )
// }

type Mode = "explore" | "practice" | "challenge"

const BottomNavigation: FC<{
  disabled: boolean
  mode: Mode
  onModeChanged: (mode: Mode) => void
}> = ({ disabled, mode, onModeChanged }) => {
  const ACTIVE_CLASSES = "active bg-base-300 text-base-900"
  const INACTIVE_CLASSES = "bg-base-200"
  return (
    <div className="btm-nav">
      <button
        disabled={disabled}
        className={classNames(mode === "explore" ? ACTIVE_CLASSES : INACTIVE_CLASSES)}
        onClick={() => onModeChanged("explore")}
      >
        {/* <SunIcon className="size-6" /> */}
        <Ear className="size-6" />
        <span className="btm-nav-label">Explore</span>
      </button>
      <button
        disabled={disabled}
        className={classNames(mode === "practice" ? ACTIVE_CLASSES : INACTIVE_CLASSES)}
        onClick={() => onModeChanged("practice")}
      >
        {/* <PaperAirplaneIcon className="size-6" /> */}
        <Target className="size-6" />
        <span className="btm-nav-label">Practice</span>
      </button>
      <button
        disabled={disabled}
        className={classNames(mode === "challenge" ? ACTIVE_CLASSES : INACTIVE_CLASSES)}
        onClick={() => onModeChanged("challenge")}
      >
        {/* <RocketLaunchIcon className="size-6" /> */}
        <BrainCircuit className="size-6" />
        <span className="btm-nav-label">Challenge</span>
      </button>
    </div>
  )
}

function randomPermutation(length: number): Array<number> {
  // Create a random permutation of the indices using Fisher-Yates shuffle.
  const indices = Array.from({ length }, (_, i) => i)
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

// TODO
// - Should also give auditory feedback
// - Permutation
// - Progress in single mode
// - Mistakes explicitly retried

type ModeState = "ready" | "playing" | "picking" | "celebration" | "end"
type TrialResult =
  | "correct"
  | "wrong"
  // not yet tried
  | null

export const PlayPage: FC = () => {
  const navigate = useNavigate()
  const params = useParams<{ chapter: string; mode: string }>()
  // const [navigationDisabled, setNavigationDisabled] = useState(false)

  // this should be run only once per application lifetime
  const [initParticles, setInitParticles] = useState(false)
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadConfettiPreset(engine)
      setInitParticles(true)
    })
  }, [])

  useEffect(() => {
    console.log("params.mode", params.mode)
    if (params.mode === "practice") {
      initializeSingleMode()
    }
  }, [params.mode])

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

  const [modeState, setModeState] = useState<ModeState>("ready")
  // This is the initial number of rounds, not including the ones added due to mistakes.
  const [numOriginalRounds, setNumOriginalRounds] = useState<number>(0)
  // This will be extended if the user makes a mistake.
  const [singleModeRounds, setSingleModeRounds] = useState<Array<number>>([])
  // const [roundsOfSequenceMode, setRoundsOfSequenceMode] = useState<Array<Array<number>>>([])
  const [currentRound, setCurrentRound] = useState<number>(0)
  const [numSuccesses, setNumSuccesses] = useState<number>(0)
  const [numFailures, setNumFailures] = useState<number>(0)

  const [practicePlayedIndex, setPracticePlayedIndex] = useState<number | null>(null)
  const [practicePickedIndex, setPracticePickedIndex] = useState<number | null>(null)

  const initializeSingleMode = () => {
    const length = Math.min(chapterData.names.length, 3)
    const indices = randomPermutation(length)
    setNumOriginalRounds(length)
    setSingleModeRounds(indices)
    setNumSuccesses(0)
    setNumFailures(0)
    setCurrentRound(0)
  }

  const onCardClicked = (index: number) => {
    if (currentPlaying !== null) {
      stopPlaying(currentPlaying)
      onEndPlaying(currentPlaying)
    }
    if (mode === "explore") {
      // setNavigationDisabled(true)
      setCurrentPlaying(index)
      startPlaying(index)
    } else if (mode === "practice") {
      if (modeState === "picking") {
        const played = singleModeRounds[currentRound]
        const picked = index
        setPracticePlayedIndex(played)
        setPracticePickedIndex(picked)
        // Use a local variable as the setters are async.
        let numActualRounds = singleModeRounds.length
        if (played === picked) {
          setNumSuccesses(numSuccesses + 1)
        } else {
          setNumFailures(numFailures + 1)
          // Add the failed index to the end of the queue.
          numActualRounds += 1
          setSingleModeRounds([...singleModeRounds, played])
        }

        const nextRound = currentRound + 1
        setCurrentRound(nextRound)
        if (nextRound < numActualRounds) {
          setModeState("ready")
        } else {
          setModeState("celebration")
          setTimeout(() => {
            setModeState("end")
          }, 3000)
        }
      }
    } else if (mode === "challenge") {
    }
  }

  const playNextRound = () => {
    setModeState("playing")
    setPracticePlayedIndex(null)
    setPracticePickedIndex(null)
    const index = singleModeRounds[currentRound]
    // setCurrentPlaying(index)
    startPlaying(index)
  }

  const onEndPlaying = (index: number) => {
    // setNavigationDisabled(false)
    setCurrentPlaying(null)
    if (mode === "practice") {
      setModeState("picking")
      setPracticePlayedIndex(index)
    }
  }

  const borderState = (index: number): BorderState => {
    if (mode === "explore") {
      return currentPlaying === index ? "selected" : null
    }
    if (mode === "practice") {
      if (practicePickedIndex === null) {
        return null
      }
      if (practicePickedIndex === index) {
        return practicePlayedIndex === index ? "correct" : "wrong"
      }
      if (practicePlayedIndex === index) {
        return "correct"
      }
      return null
    }
    return null
  }

  return (
    <>
      {/* Fake node for audio elements. */}
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
          "relative grid h-dvh grid-cols-1 grid-rows-[auto_auto_1fr] items-center",
          "items-center justify-center portrait:flex-col",
        )}
      >
        {/* Nav bar */}
        <div className="navbar bg-base-200 shadow-sm">
          <a className="btn btn-ghost text-xl">
            {singleModeRounds.join(", ")}|{currentRound}/{numOriginalRounds}
          </a>
        </div>

        <ProgressBar numSuccesses={numSuccesses} numTotal={numOriginalRounds} />

        {/* Board */}
        <div
          className={classNames(
            "mb-16 overflow-clip px-2",
            "portrait:w-full portrait:max-w-[40rem]",
            "landscape:h-dvh landscape:w-[40rem]",
            `grid place-items-stretch gap-2 ${chapterData.classNames}`,
            // { "blur-sm": mode === "practice" && practicePlayedIndex === null },
          )}
        >
          {chapterData.names.map((name, index) => (
            <Card
              key={index}
              disabled={
                !(
                  mode === "explore" ||
                  (mode === "practice" && modeState === "picking")
                )
              }
              chapter={chapter}
              imageId={index}
              title={name.name}
              borderState={borderState(index)}
              onClick={() => onCardClicked(index)}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 mb-20 flex items-center justify-center px-2 py-2">
          {mode == "practice" && modeState === "ready" && (
            <div className="flex w-full items-center justify-center">
              <button
                onClick={() => {
                  playNextRound()
                }}
              >
                <PlayCircleIcon className="size-48 rounded-full border-2 border-black bg-black text-yellow-500 blur-none drop-shadow-xl" />
              </button>
            </div>
          )}
          {mode == "practice" && modeState === "end" && (
            <div className="flex w-full items-center justify-center">
              <button
                onClick={() => {
                  initializeSingleMode()
                }}
              >
                <RotateCcw className="size-48 rounded-full border-2 border-black bg-black text-yellow-500 blur-none drop-shadow-xl" />
              </button>
            </div>
          )}
        </div>
      </div>
      <BottomNavigation
        disabled={modeState === "playing" || modeState === "celebration"}
        mode={mode}
        onModeChanged={(mode: Mode) =>
          navigate(`/play/${chapter}/${mode}`, { replace: true })
        }
      />
      {initParticles && modeState === "celebration" && (
        <Particles id="tsparticles" options={CONFETTI_OPTIONS} />
      )}
    </>
  )
}

const CONFETTI_OPTIONS: ISourceOptions = {
  preset: "confetti",
}

const ProgressBar: FC<{
  numSuccesses: number
  numTotal: number
}> = ({ numSuccesses, numTotal }) => {
  return (
    <div className="my-2 w-full px-2">
      <progress
        className="progress progress-success rounded-none"
        value={numSuccesses}
        max={numTotal}
      />
    </div>
  )
  {
    /*<div className="my-4 flex w-full justify-stretch px-2">
       <progress
        className="progress progress-success w-0 rounded-none"
        style={{ flexGrow: numTotal - numFailures }}
        value={numSuccesses}
        max={numTotal - numFailures}
      ></progress>
      <progress
        className="progress progress-error w-0 rounded-none"
        style={{ flexGrow: numFailures }}
        value={1}
        max={1}
      ></progress> 
    </div>*/
  }
}
