import { expect, test } from "vitest"

import { fixRepeatedIndices } from "./sequences"

test("fixes repeated indices", () => {
  expect(fixRepeatedIndices([1, 2], 12)).toStrictEqual([1, 2])
  expect(fixRepeatedIndices([1, 1], 12)).toStrictEqual([1, 0])
  expect(fixRepeatedIndices([1, 0, 1], 12)).toStrictEqual([1, 0, 2])
  expect(fixRepeatedIndices([1, 5, 6, 2, 5, 0], 12)).toStrictEqual([1, 5, 6, 2, 0, 3])
})
