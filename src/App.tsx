import { FC, StrictMode, useContext } from "react"

import { GameContext, GameProvider } from "./GameContext"
import { LobbyPage } from "./LobbyPage"
import { PlayPage } from "./PlayPage"

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
      {stage === "play" && <PlayPage />}
      {stage === "result" && <ResultPage />}
    </>
  )
}

function App() {
  return (
    <>
      <StrictMode>
        <div className="h-screen">
          <GameProvider>
            <Screen />
          </GameProvider>
        </div>
      </StrictMode>
    </>
  )
}

export default App
