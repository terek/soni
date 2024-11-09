interface ChapterData {
  id: string
  title: string
  numRows: number
  numCols: number
  classNames: string
  names: Array<{ id: string; name: string }>
}

export const CHAPTER_DATA: Record<string, ChapterData> = {
  "01": {
    id: "01",
    title: "Háziállatok",
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
    title: "Vadállatok",
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
    title: "Madarak",
    numRows: 3,
    numCols: 4,
    classNames:
      "portrait:grid-cols-3 portrait:grid-rows-4 landscape:grid-cols-4 landscape:grid-rows-3",
    names: [
      { id: "kakas", name: "kakas" },
      { id: "tyuk", name: "tyúk" },
      { id: "kacsa", name: "kacsa" },
      { id: "liba", name: "liba" },
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
    title: "Járművek",
    numRows: 3,
    numCols: 4,
    classNames:
      "portrait:grid-cols-3 portrait:grid-rows-4 landscape:grid-cols-4 landscape:grid-rows-3",
    names: [
      { id: "auto", name: "autó" },
      { id: "mento", name: "mentő" },
      { id: "versenyauto", name: "versenyautó" },
      { id: "gozmozdony", name: "gőzmozdony" },
      { id: "teherauto", name: "teherautó" },
      { id: "kerekpar", name: "kerékpár" },
      { id: "metro", name: "metró" },
      { id: "traktor", name: "traktor" },
      { id: "helikopter", name: "helikopter" },
      { id: "hajo", name: "hajó" },
      { id: "motorbicikli", name: "motorbicikli" },
      { id: "repulo", name: "repülő" },
    ],
  },
}

export function getChapters(): Array<ChapterData> {
  const values = Object.values(CHAPTER_DATA) as Array<ChapterData>
  return values
}
