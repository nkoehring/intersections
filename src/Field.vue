<template>
  <svg id="field" :viewBox='`0 0 ${settings.width} ${settings.height}`' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
    <defs>
      <filter id="grid-filter" filterUnits="userSpaceOnUse" x="-5%" y="-5%" width="110%" height="110%">
        <feGaussianBlur in="StrokePaint" stdDeviation="10" />
      </filter>

      <g id="citadel-walls">
        <polygon points="10,0 20,0 30,10 30,20 20,30 10,30 0,20 0,10" />
      </g>
    </defs>

    <g class="citadels">
      <citadel v-for="(c,i) in citadels" v-if="c"
        :key="i"
        :value="c.value"
        :selected="c.selected"
        :highlighted="c.highlighted"
        :owner="c.owner"
        :x="(i % columns) * distance + distance / 1.2"
        :y="Math.floor(i / columns) * distance + distance / 3"
        @selection="select(i)"
      />
    </g>

    <g @click="finishRound()" :transform="`translate(${settings.width / 2 - 100},${settings.height - 32})`">
      <svg-button :label="finishRoundLabel" />
    </g>
  </svg>
</template>

<script>
import Citadel from './Citadel'
import SvgButton from './Button'
import { populateField, neighbours, conquer } from './tools'

export default {
  name: 'citadels-field',
  props: [ 'settings' ],
  components: { Citadel, SvgButton },
  data () {
    return {
      distance: 80,
      citadels: [],
      selection: null,
      neighbours: [],
      mode: 'conquer', // 'conquer' or 'recharge'
      energy: 0
    }
  },
  beforeMount () {
    this.citadels = populateField(this.rows, this.columns, this.settings.players.length)
  },
  computed: {
    columns () {
      return Math.floor(this.settings.width / this.distance) - 1
    },
    rows () {
      return Math.floor(this.settings.height / this.distance)
    },
    finishRoundLabel () {
      if (this.mode === 'conquer')
        return 'finish round'
      else
        return this.energy > 0 ? `spend ${this.energy} points` : 'next player'
    }
  },
  methods: {
    reset () {
      let idx
      for(idx in this.citadels) {
        const c = this.citadels[idx]
        c.selected = false
        c.highlighted = false
      }
    },
    select (i) {
      const citadel = this.citadels[i]
      const ownedByPlayer = citadel.owner === this.settings.currentPlayer

      if (this.mode === 'conquer') {
        const nothingSelected = this.selection === null
        const notSelection = this.selection !== i
        const hasValue = citadel.value > 1
        const isNeighbour = this.neighbours.indexOf(i) >= 0

        if (nothingSelected && ownedByPlayer && hasValue) {
          this.reset()
          this.selection = i
          citadel.selected = true
          this.neighbours = neighbours(i, this.columns, this.citadels)
          this.neighbours.forEach(c => {
            const citadel  = this.citadels[c]
            citadel.highlighted = citadel.owner !== this.settings.currentPlayer
          })

        } else if (notSelection && !ownedByPlayer && isNeighbour) {
          conquer(this.citadels[this.selection], this.citadels[i])
          this.reset()
          this.selection = null
          this.neighbours = []

        } else if (!notSelection) {
          this.reset()
          this.selection = null
          this.neighbours = []
        }

      } else {
        const isNotFull = citadel.value < citadel.volume

        if (ownedByPlayer && this.energy && isNotFull) {
          citadel.value += 1
          this.energy -= 1
          citadel.highlighted = citadel.value < citadel.volume
        }
      }
    },
    finishRound () {
      this.reset()

      if (this.mode === 'conquer') {
        this.mode = 'recharge'

        let energy = 0
        this.citadels.forEach(c => {
          if (c.owner === this.settings.currentPlayer) {
            energy++
            c.highlighted = c.value < c.volume
          }
        })

        this.energy = energy

      } else {
        this.mode = 'conquer'
      }
    }
  }
}
</script>

<style>
  #field {
    display: block;
    width: 100%;
    height: 100%;
    background: #333;
  }

  #field g.button { cursor: pointer; }
  #field g.button:hover > rect { stroke-width: 2; }
  #field g.button:hover > text { fill: #FFF; }
  #field g.button > rect {
    stroke: #ccc;
    fill: transparent;
  }
  #field g.button > text {
    stroke: none;
    fill: #CCC;
    font-size: 1.8rem;
    text-anchor: middle;
  }
</style>
