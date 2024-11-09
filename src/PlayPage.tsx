// import { CheckCircleIcon, CircleStackIcon } from "@heroicons/react/24/solid"

import { ISourceOptions } from "@tsparticles/engine"
import { loadConfettiPreset } from "@tsparticles/preset-confetti"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import classNames from "classnames"
import { motion } from "framer-motion"
import {
  AudioWaveformIcon,
  CheckIcon,
  PlayIcon,
  RocketIcon,
  RotateCcwIcon,
  Volume2Icon,
} from "lucide-react"
import { FC, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { CHAPTER_DATA } from "./levels"

type BorderState = "selected" | "correct" | "wrong" | null

function Card({
  disabled,
  chapterId,
  imageId,
  title,
  borderState,
  onClick,
}: {
  disabled: boolean
  chapterId: string
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
      <img className="" src={`/tiles/${chapterId}/${indexStr}.jpg`} alt={title} />
      <span className="text-xs">{title}</span>
    </motion.button>
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

type ModeState =
  | "initial"
  | "playing-explore"
  | "prepare"
  | "playing-practice"
  | "picking"
  | "feedback"
  | "celebration"
  | "end"

export const PlayPage: FC = () => {
  const navigate = useNavigate()
  const params = useParams<{ chapter: string }>()
  const chapterId = params.chapter ?? "01"
  const chapterData = useMemo(() => CHAPTER_DATA[chapterId!], [chapterId])

  // this should be run only once per application lifetime
  const [initParticles, setInitParticles] = useState(false)
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadConfettiPreset(engine)
      setInitParticles(true)
    })
  }, [])

  // useEffect(() => {
  //   resetChapter()
  // }, [params.chapter])

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

  const [modeState, setModeState] = useState<ModeState>("initial")
  // This is the initial number of rounds, not including the ones added due to mistakes.
  const [numOriginalRounds, setNumOriginalRounds] = useState<number>(0)
  // This will be extended if the user makes a mistake.
  const [singleModeRounds, setSingleModeRounds] = useState<Array<number>>([])
  // const [roundsOfSequenceMode, setRoundsOfSequenceMode] = useState<Array<Array<number>>>([])
  const [currentRound, setCurrentRound] = useState<number>(0)
  const [numSuccesses, setNumSuccesses] = useState<number>(0)
  const [numFailures, setNumFailures] = useState<number>(0)

  const [explorePlayingIndex, setExplorePlayingIndex] = useState<number | null>(null)
  const [practicePlayedIndex, setPracticePlayedIndex] = useState<number | null>(null)
  const [practicePickedIndex, setPracticePickedIndex] = useState<number | null>(null)

  const initializeSingleMode = () => {
    setModeState("prepare")
    // const length = Math.min(chapterData.names.length, 1)
    const length = chapterData.names.length
    const indices = randomPermutation(length)
    setNumOriginalRounds(length)
    setSingleModeRounds(indices)
    setNumSuccesses(0)
    setNumFailures(0)
    setCurrentRound(0)
  }

  const onCardClicked = (index: number) => {
    if (explorePlayingIndex !== null) {
      stopPlaying(explorePlayingIndex)
      onEndPlaying(explorePlayingIndex)
    }
    if (modeState === "initial") {
      setModeState("playing-explore")
      setExplorePlayingIndex(index)
      startPlaying(index)
    }
    if (modeState === "playing-practice" || modeState === "picking") {
      const played = singleModeRounds[currentRound]
      const picked = index
      setPracticePlayedIndex(played)
      setPracticePickedIndex(picked)
      // Use a local variable as the setters are async.
      let numActualRounds = singleModeRounds.length
      const correct = played === picked
      if (correct) {
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
        if (correct) {
          setModeState("prepare")
          setTimeout(() => {
            setPracticePickedIndex(null)
            setPracticePlayedIndex(null)
          }, 1000)
        } else {
          setModeState("feedback")
        }
      } else {
        setModeState("celebration")
        setTimeout(() => {
          setPracticePickedIndex(null)
          setPracticePlayedIndex(null)
          setModeState("end")
        }, 3000)
      }
    }
  }

  const playNextRound = () => {
    setPracticePlayedIndex(null)
    setPracticePickedIndex(null)
    setModeState("playing-practice")
    const index = singleModeRounds[currentRound]
    startPlaying(index)
  }

  const replaySound = () => {
    setModeState("playing-practice")
    const index = singleModeRounds[currentRound]
    startPlaying(index)
  }

  const onEndPlaying = (index: number) => {
    if (modeState == "playing-explore") {
      setModeState("initial")
      setExplorePlayingIndex(null)
    } else if (modeState === "playing-practice") {
      setModeState("picking")
      setPracticePlayedIndex(index)
    }
  }

  const borderState = (index: number): BorderState => {
    if (modeState === "playing-explore" && explorePlayingIndex === index) {
      return "selected"
    }
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

  return (
    <>
      {/* Fake node for audio elements. */}
      <div>
        {chapterData.names.map((audioId, index) => (
          <audio
            key={audioId.id}
            id={`audio_${audioId.id}`}
            src={`/sounds/${chapterId}/${audioId.id}.ogg`}
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
        <div className="navbar flex justify-stretch bg-base-200 shadow-sm">
          <span className="btn btn-ghost">
            <AudioWaveformIcon className="size-8" />
            <a className="text-xl">
              Soni/{modeState}
              {/* {singleModeRounds.join(", ")}|{currentRound}/{numOriginalRounds} */}
            </a>
          </span>
          <div className="grow" />
          <select
            className="select max-w-xs"
            value={chapterId}
            onChange={(e) => navigate(`/play/${e.target.value}`)}
          >
            {Object.keys(CHAPTER_DATA).map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>
        </div>

        <div
          className={classNames("my-2 w-full px-2", {
            invisible: modeState == "initial" || modeState == "playing-explore",
          })}
        >
          <ProgressBar numSuccesses={numSuccesses} numTotal={numOriginalRounds} />
        </div>

        {/* Board */}
        <div
          className={classNames(
            "overflow-clip-x mb-16 px-2",
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
                !["initial", "playing-explore", "playing-practice", "picking"].includes(
                  modeState,
                )
              }
              chapterId={chapterId}
              imageId={index}
              title={name.name}
              borderState={borderState(index)}
              onClick={() => onCardClicked(index)}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex h-24 items-center justify-center bg-base-300 px-2 py-2">
          {modeState === "initial" && (
            <Button onClick={initializeSingleMode}>
              <RocketIcon className="size-16" />
            </Button>
          )}
          {modeState === "prepare" && (
            <Button onClick={playNextRound}>
              <PlayIcon className="size-16" />
            </Button>
          )}
          {(modeState === "playing-practice" || modeState === "playing-explore") && (
            <span className="loading loading-ring loading-md"></span>
          )}
          {modeState === "picking" && (
            <Button onClick={replaySound}>
              <Volume2Icon className="size-16" />
            </Button>
          )}
          {modeState === "feedback" && (
            <Button onClick={playNextRound}>
              <CheckIcon className="size-16" />
            </Button>
          )}
          {modeState === "end" && (
            <Button onClick={initializeSingleMode}>
              <RotateCcwIcon className="size-16" />
            </Button>
          )}
        </div>
      </div>
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
    <progress
      className="progress progress-success rounded-none"
      value={numSuccesses}
      max={numTotal}
    />
  )
}

const Button: FC<{
  onClick: () => void
  children: React.ReactNode
}> = ({ onClick, children }) => {
  return (
    <button
      className="flex size-20 items-center justify-center rounded-full bg-black text-yellow-500 blur-none drop-shadow-xl"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
