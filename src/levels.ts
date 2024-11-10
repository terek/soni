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
  "05": {
    id: "05",
    title: "Emberek 1",
    numRows: 2,
    numCols: 4,
    classNames:
      "portrait:grid-cols-2 portrait:grid-rows-4 landscape:grid-cols-4 landscape:grid-rows-2",
    names: [
      { id: "siras", name: "sírás" },
      { id: "kohoges", name: "köhögés" },
      { id: "nevetes", name: "nevetés" },
      { id: "horkolas", name: "horkolás" },

      { id: "indiankialtas", name: "indíánkiáltás" },
      { id: "eves", name: "evés" },
      { id: "asitas", name: "áshatás" },
      { id: "tapsolas", name: "tapsolás" },
    ],
  },
  "06": {
    id: "06",
    title: "Emberek 2",
    numRows: 2,
    numCols: 4,
    classNames:
      "portrait:grid-cols-2 portrait:grid-rows-4 landscape:grid-cols-4 landscape:grid-rows-2",
    names: [
      { id: "puszi", name: "puszi" },
      { id: "jodlizas", name: "jodlizás" },
      { id: "liheges", name: "lihegés" },
      { id: "tusszentes", name: "tüsszentés" },

      { id: "szurcsoles", name: "szürcsölés" },
      { id: "almaharapas", name: "almaharapás" },
      { id: "sikitas", name: "síkítás" },
      { id: "futtyentes", name: "futtyogás" },
    ],
  },
  "07": {
    id: "07",
    title: "Helyek (természet)",
    numRows: 2,
    numCols: 3,
    classNames:
      "portrait:grid-cols-2 portrait:grid-rows-3 landscape:grid-cols-3 landscape:grid-rows-2",
    names: [
      { id: "tengerpart", name: "tengerpart" },
      { id: "nadas", name: "nádas" },
      { id: "baromfiudvar", name: "baromfiudvar" },

      { id: "utca", name: "utca" },
      { id: "erdo", name: "erdő" },
      { id: "dzsungel", name: "dzsungel" },
    ],
  },
  "08": {
    id: "08",
    title: "Helyek (város)",
    numRows: 2,
    numCols: 3,
    classNames:
      "portrait:grid-cols-2 portrait:grid-rows-3 landscape:grid-cols-3 landscape:grid-rows-2",
    names: [
      { id: "iskolaudvar", name: "iskolaudvar" },
      { id: "etterem", name: "étterem" },
      { id: "szinhaz", name: "színház" },

      { id: "buszpalyaudvar", name: "buszpályaudvar" },
      { id: "stadion", name: "stadion" },
      { id: "cirkusz", name: "cirkusz" },
    ],
  },
  "09": {
    id: "09",
    title: "Víz",
    numRows: 3,
    numCols: 4,
    classNames:
      "portrait:grid-cols-3 portrait:grid-rows-4 landscape:grid-cols-4 landscape:grid-rows-3",
    names: [
      { id: "jegkocka", name: "jégkocka" },
      { id: "vihar", name: "vihar" },
      { id: "csobbanas", name: "csobbanás" },
      { id: "kezmosas", name: "kezmosás" },

      { id: "buvar", name: "búvár" },
      { id: "eso", name: "eső" },
      { id: "zuhanyozas", name: "zuhanyozás" },
      { id: "WC_oblites", name: "WC-öblítés" },

      { id: "vizeses", name: "vízesés" },
      { id: "buborekolas", name: "buborékolás" },
      { id: "hullamveres", name: "hullámverés" },
      { id: "szoda", name: "szóda" },
    ],
  },
}

export function getChapters(): Array<ChapterData> {
  const values = Object.values(CHAPTER_DATA) as Array<ChapterData>
  return values
}
