export type Level = "01" | "02" | "03" | "04"

interface LevelData {
  id: string
  numRows: number
  numCols: number
  classNames: string
  names: Array<{ id: string; name: string }>
}

export const LEVEL_DATA: Record<Level, LevelData> = {
  "01": {
    id: "01",
    numRows: 3,
    numCols: 4,
    classNames:
      "portrait:grid-cols-3 portrait:grid-rows-4 landscape:grid-cols-4 landscape:grid-rows-3",
    names: [
      { id: "kutya", name: "kutya" },
      { id: "macska", name: "macska" },
      { id: "tehen", name: "tehén" },
      { id: "diszno", name: "disznó" },
      { id: "lo", name: "ló" },
      { id: "kecske", name: "kecske" },
      { id: "szamar", name: "szamár" },
      { id: "birka", name: "birka" },
      { id: "oz", name: "őz" },
      { id: "lama", name: "láma" },
      { id: "nyul", name: "nyúl" },
      { id: "teve", name: "teve" },
    ],
  },
  "02": {
    id: "02",
    numRows: 3,
    numCols: 4,
    classNames:
      "portrait:grid-cols-3 portrait:grid-rows-4 landscape:grid-cols-4 landscape:grid-rows-3",
    names: [
      { id: "csorgokigyo", name: "csörgőkígyó" },
      { id: "oroszlan", name: "oroszlán" },
      { id: "delfin", name: "delfin" },
      { id: "krokodil", name: "krokodil" },
      { id: "medve", name: "medve" },
      { id: "mehecske", name: "méhecske" },
      { id: "gorilla", name: "gorilla" },
      { id: "beka", name: "béka" },
      { id: "elefant", name: "elefánt" },
      { id: "balna", name: "bálna" },
      { id: "tucsok", name: "tücsök" },
      { id: "pele", name: "mókus" },
    ],
  },
  "03": {
    id: "03",
    numRows: 3,
    numCols: 4,
    classNames:
      "portrait:grid-cols-3 portrait:grid-rows-4 landscape:grid-cols-4 landscape:grid-rows-3",
    names: [
      { id: "kakas", name: "kakas" },
      { id: "kacsa", name: "kacsa" },
      { id: "liba", name: "liba" },
      { id: "tyuk", name: "tyúk" },
      { id: "pulyka", name: "pulyka" },
      { id: "bagoly", name: "bagoly" },
      { id: "golya", name: "gólya" },
      { id: "siraly", name: "sirály" },
      { id: "varju", name: "varjú" },
      { id: "galamb", name: "galamb" },
      { id: "fakopancs", name: "fakopáncs" },
      { id: "papagaj", name: "papagáj" },
    ],
  },
  "04": {
    id: "04",
    numRows: 3,
    numCols: 4,
    classNames:
      "portrait:grid-cols-3 portrait:grid-rows-4 landscape:grid-cols-4 landscape:grid-rows-3",
    names: [
      { id: "auto", name: "autó" },
      { id: "gozmozdony", name: "gőzmozdony" },
      { id: "hajo", name: "hajó" },
      { id: "helikopter", name: "helikopter" },
      { id: "kerekpar", name: "kerékpár" },
      { id: "mento", name: "mentő" },
      { id: "metro", name: "metró" },
      { id: "motorbicikli", name: "motorbicikli" },
      { id: "repulo", name: "repülő" },
      { id: "teherauto", name: "teherautó" },
      { id: "traktor", name: "traktor" },
      { id: "versenyauto", name: "versenyautó" },
    ],
  },
}

export function getLevels(): Array<Level> {
  const keys = Object.keys(LEVEL_DATA) as Array<Level>
  return keys
}
