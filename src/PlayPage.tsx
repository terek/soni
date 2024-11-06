// import { CheckCircleIcon, CircleStackIcon } from "@heroicons/react/24/solid"

import classNames from "classnames"
import { FC, useContext, useMemo, useState } from "react"

import { GameContext } from "./GameContext"
import { Chapter, CHAPTER_DATA } from "./levels"

type BorderState = "selected" | "correct" | "wrong" | null

function Card({
  chapter,
  imageId,
  audioId,
  borderState,
  onClick,
  onEndPlaying,
}: {
  chapter: Chapter
  imageId: number
  audioId: string
  borderState: BorderState
  onClick: () => void
  onEndPlaying?: () => void
}) {
  const indexStr = useMemo(() => imageId.toString().padStart(2, "0"), [imageId])
  return (
    <>
      <img
        className={classNames(
          "box-border rounded-xl border-4 bg-blue-900 text-3xl text-blue-200",
          {
            "border-blue-500": borderState === "selected",
            "border-red-500": borderState === "wrong",
            "border-green-500": borderState === "correct",
            "border-transparent": borderState === null,
          },
        )}
        src={`tiles/${chapter}/${indexStr}.jpg`}
        onClick={onClick}
      />
      <audio
        id={`audio_${audioId}`}
        src={`sounds/${chapter}/${audioId}.ogg`}
        onEnded={onEndPlaying}
      />
    </>
  )
}

const TestStateIndicator: FC = () => {
  // const { testState } = useContext(GameContext)'
  const testState = "playing"
  return (
    <div>
      <img
        className={classNames("h-20", { invisible: testState !== "playing" })}
        src="listening.png"
        alt="Listen"
      />
    </div>
  )
}

export const PlayPage: FC = () => {
  console.log("PlayPage")
  type TestState = "playing" | "answering" | "correct" | "wrong"
  const [playStage, setPlayStage] = useState<"warmup" | "test" | "result">("warmup")
  const [testState, setTestState] = useState<TestState>("playing")
  // const [playingIndex, setPlayingIndex] = useState<number | null>(null)

  const { stage, setStage } = useContext(GameContext)
  // const chapterData = useMemo(() => CHAPTER_DATA[chapter], [chapter])

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

  const runSingleTest = () => {}
  const runSeriesTest = () => {}

  const { chapter } = useContext(GameContext)
  const chapterData = useMemo(() => CHAPTER_DATA[chapter], [chapter])
  const audioIds = useMemo(
    () => chapterData.names.map((name) => `audio_${name.id}`),
    [chapterData],
  )

  // Warmup, Try and Test logic
  // In warmup, the user can listen to the audio by clicking on the card
  // In try, the user hears the audio and then has to select the correct card
  // In test, the user listens to multiple series of audio and has to select the cards
  // in the correct order in each step.

  type States = "waiting" | "warmup:listen" | "try:listen" | "try:result"
  const [state, setState] = useState<States>("waiting")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [tryPlayedIndex, setTryPlayedIndex] = useState<number | null>(null)
  const [tryPickedIndex, setTryPickedIndex] = useState<number | null>(null)

  // const [currentPlaying, setCurrentPlaying] = useState<number | null>(null)
  // const startPlaying = (index: number) => {
  //   if (currentPlaying !== null) {
  //     const id = chapterData.names[currentPlaying].id
  //     const audioElement = document.getElementById(`audio_${id}`)! as HTMLAudioElement
  //     audioElement.pause()
  //   }
  //   setCurrentPlaying(index)
  //   const id = chapterData.names[index].id
  //   const audioElement = document.getElementById(`audio_${id}`)! as HTMLAudioElement
  //   audioElement.play()
  // }

  const onCardClicked = (index: number) => {
    // Is clicking allowed?
    if (state === "warmup:listen") {
      // Stop the currently playing audio
    }
    if (state === "waiting") {
      return
    } else {
    }
  }
  const onEndPlaying = (index: number) => {
    // setCurrentPlaying(null)
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
      <div
        className={classNames(
          "flex h-full gap-4",
          "items-center justify-center portrait:flex-col",
        )}
      >
        <TestStateIndicator />
        {/* Board */}
        <div className="flex flex-col items-center justify-start bg-blue-800">
          <div
            className={classNames(
              "m-0",
              "portrait:w-full portrait:max-w-[40rem]",
              "landscape:h-full landscape:w-[40rem]",
              `grid place-items-stretch gap-2 ${chapterData.classNames}`,
            )}
          >
            {chapterData.names.map((name, index) => (
              <div key={index}>
                <Card
                  chapter={chapter}
                  imageId={index}
                  audioId={name.id}
                  borderState={
                    state == "warmup:listen" && selectedIndex == index
                      ? "selected"
                      : state == "try:result"
                        ? tryPlayedIndex == tryPickedIndex
                          ? tryPickedIndex == index
                            ? "correct"
                            : null
                          : tryPickedIndex == index
                            ? "wrong"
                            : tryPlayedIndex == index
                              ? "correct"
                              : null
                        : null
                  }
                  onClick={() => onCardClicked(index)}
                  onEndPlaying={() => onEndPlaying(index)}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Controls */}
        <div
          className={classNames("flex items-center justify-center gap-4", {
            invisible:
              playStage === "test" && ["playing", "answering"].includes(testState),
          })}
        >
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
          <button className="btn btn-primary" onClick={runSingleTest}>
            Test
          </button>
          <button className="btn btn-primary" onClick={runSeriesTest}>
            Series
          </button>
          <button className="btn btn-primary" onClick={() => setStage("lobby")}>
            Vissza!
          </button>
        </div>
      </div>
    </>
  )
}
