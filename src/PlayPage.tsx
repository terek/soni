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
  SquareXIcon,
  ThumbsDownIcon,
  TrophyIcon,
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
          "blur-sm": disabled,
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
  | "playing-feedback"
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

  const [adhocPlayingIndex, setAdhocPlayingIndex] = useState<number | null>(null)
  const [practicePlayedIndex, setPracticePlayedIndex] = useState<number | null>(null)
  const [practicePickedIndex, setPracticePickedIndex] = useState<number | null>(null)

  const initializeSingleMode = () => {
    setModeState("prepare")
    // const length = 2
    const length = chapterData.names.length
    const indices = randomPermutation(length)
    setNumOriginalRounds(length)
    setSingleModeRounds(indices)
    setNumSuccesses(0)
    setNumFailures(0)
    setCurrentRound(0)
  }

  const onTimeoutFeedbackToPrepare = () => {
    if (modeState === "feedback") {
      setModeState("prepare")
      setPracticePickedIndex(null)
      setPracticePlayedIndex(null)
    }
  }

  const onCardClicked = (index: number) => {
    if (adhocPlayingIndex !== null) {
      stopPlaying(adhocPlayingIndex)
      onEndPlaying(adhocPlayingIndex)
    }
    if (modeState === "initial") {
      setModeState("playing-explore")
      setAdhocPlayingIndex(index)
      startPlaying(index)
    }
    if (modeState === "feedback") {
      setModeState("playing-feedback")
      setAdhocPlayingIndex(index)
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
          setModeState("feedback")
          setTimeout(onTimeoutFeedbackToPrepare, 2000)
        } else {
          setModeState("playing-feedback")
          setAdhocPlayingIndex(picked)
          if (modeState === "playing-practice") {
            stopPlaying(played)
          }
          startPlaying(picked)
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

  const onFeedbackAccepted = () => {
    setPracticePlayedIndex(null)
    setPracticePickedIndex(null)
    setModeState("prepare")
  }

  const replaySound = () => {
    setModeState("playing-practice")
    const index = singleModeRounds[currentRound]
    startPlaying(index)
  }

  const onEndPlaying = (index: number) => {
    if (modeState == "playing-explore") {
      setModeState("initial")
      setAdhocPlayingIndex(null)
    } else if (modeState === "playing-practice") {
      setModeState("picking")
      setPracticePlayedIndex(index)
    } else if (modeState === "playing-feedback") {
      setModeState("feedback")
      setAdhocPlayingIndex(null)
    }
  }

  const borderState = (index: number): BorderState => {
    if (modeState === "playing-explore" && adhocPlayingIndex === index) {
      return "selected"
    }
    if (practicePickedIndex === null) {
      return null
    }
    if (modeState === "playing-feedback") {
      if (adhocPlayingIndex !== null && adhocPlayingIndex !== index) {
        return null
      }
      if (practicePickedIndex === index && practicePlayedIndex !== index) {
        return "wrong"
      } else if (practicePlayedIndex === index) {
        return "correct"
      }
    }
    if (modeState === "feedback") {
      if (practicePlayedIndex === index) {
        return "correct"
      }
      if (practicePickedIndex === index) {
        return "wrong"
      }
    }
    return null
  }

  const showCloseModal = () => {
    const modal = document.getElementById("close_modal")! as HTMLDialogElement
    modal.showModal()
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
              Soni
              {/* {singleModeRounds.join(", ")}|{currentRound}/{numOriginalRounds} */}
            </a>
          </span>
          <div className="grow" />
          <button className="btn btn-ghost" onClick={showCloseModal}>
            <SquareXIcon className="size-8" />
          </button>
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
            "overflow-clip-x relative mb-16 px-2",
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
                  ["initial", "playing-practice", "picking"].includes(modeState) ||
                  (["playing-explore", "playing-feedback"].includes(modeState) &&
                    adhocPlayingIndex === index) ||
                  (modeState === "feedback" &&
                    (practicePlayedIndex === index || practicePickedIndex === index))
                )
              }
              chapterId={chapterId}
              imageId={index}
              title={name.name}
              borderState={borderState(index)}
              onClick={() => onCardClicked(index)}
            />
          ))}
          {(modeState === "celebration" || modeState == "end") && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex flex-col items-center rounded-xl border-8 border-yellow-500 bg-black p-8 text-4xl text-yellow-500">
                {numFailures > 0 ? (
                  <>
                    <ThumbsDownIcon className="size-12" />
                    <span className="mt-4">{numFailures}</span>
                  </>
                ) : (
                  <TrophyIcon className="size-12" />
                )}
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex h-24 items-center justify-center bg-base-300 px-2 py-2">
          {modeState === "initial" && (
            <Button
              onClick={() => {
                initializeSingleMode()
              }}
            >
              <RocketIcon className="size-12" />
            </Button>
          )}
          {modeState === "prepare" && (
            <Button onClick={playNextRound}>
              <PlayIcon className="size-12" />
            </Button>
          )}
          {["playing-explore", "playing-practice", "playing-feedback"].includes(
            modeState,
          ) && <span className="loading loading-ring loading-md"></span>}
          {modeState === "picking" && (
            <Button onClick={replaySound}>
              <Volume2Icon className="size-12" />
            </Button>
          )}
          {modeState === "feedback" && (
            <Button onClick={onFeedbackAccepted}>
              <CheckIcon className="size-12" />
            </Button>
          )}
          {modeState === "end" && (
            <Button onClick={initializeSingleMode}>
              <RotateCcwIcon className="size-12" />
            </Button>
          )}
        </div>
      </div>
      {initParticles && modeState === "celebration" && (
        <Particles id="tsparticles" options={CONFETTI_OPTIONS} />
      )}
      <CloseModal onCloseGame={() => navigate("/")} />
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
      className="progress progress-success"
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

const CloseModal: FC<{ onCloseGame: () => void }> = ({ onCloseGame }) => {
  return (
    <dialog id="close_modal" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Soni</h3>
        <p className="py-4">Do you want to stop the game?</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn bg-base-300">Continue</button>
            <button className="btn ml-4 bg-base-100" onClick={onCloseGame}>
              Stop
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}