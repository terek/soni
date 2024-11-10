import { AudioWaveformIcon } from "lucide-react"
import { FC, PropsWithChildren } from "react"

export const Nav: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="navbar sticky top-0 flex justify-stretch bg-base-200 shadow-sm">
      <span className="btn btn-ghost">
        <AudioWaveformIcon className="size-8" />
        <a className="text-xl">
          Soni
          {/* /{modeState}/{(sequenceModeRounds[currentRound] ?? []).join(":")}/
              {sequencePickedIndices.join(", ")} */}
          {/* {singleModeRounds.join(", ")}|{currentRound}/{numOriginalRounds} */}
        </a>
      </span>
      <div className="grow" />
      {children}
    </div>
  )
}
