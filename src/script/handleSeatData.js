import data from './2.json' with { type: 'json' }
import fs from 'fs'

const seats = data.nodes.map((node) => {
  return {
    name: node.name,
    position: {
      x: node.translation[0]*10,
      y: node.translation[2]*10,
    },
  }
})

fs.writeFileSync('output.json', JSON.stringify({ seats }, null, 2))
