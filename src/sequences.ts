export function randomPermutation(length: number): Array<number> {
  // Create a random permutation of the indices using Fisher-Yates shuffle.
  const indices = Array.from({ length }, (_, i) => i)
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

export function fixRepeatedIndices(
  indices: Array<number>,
  maxIndex: number,
): Array<number> {
  const seenIndices = new Set<number>()
  for (let k = 0; k < indices.length; k++) {
    if (seenIndices.has(indices[k])) {
      for (let i = 0; i < maxIndex; i++) {
        if (!seenIndices.has(i)) {
          indices[k] = i
          break
        }
      }
    }
    seenIndices.add(indices[k])
  }
  return indices
}

export function randomSequences(
  maxIndex: number,
  lengths: Array<number>,
): Array<Array<number>> {
  // Create a longer sequence to allow some repetitions.
  const totalLength = lengths.reduce((a, b) => a + b, 0) * 2
  const indexArray = Array.from({ length: totalLength }, (_, i) => i % maxIndex)
  // Create a random permutation of the indices using Fisher-Yates shuffle.
  for (let i = totalLength - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indexArray[i], indexArray[j]] = [indexArray[j], indexArray[i]]
  }
  const sequences = []
  let start = 0
  for (const length of lengths) {
    sequences.push(indexArray.slice(start, start + length))
    // Do not allow the same index to appear twice in a sequence.
    fixRepeatedIndices(sequences[sequences.length - 1], maxIndex)
    start += length
  }
  return sequences
}
