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
        :ownedByPlayer="c.owner === currentPlayer"
        :x="(i % columns) * distance + distance / 1.2"
        :y="Math.floor(i / columns) * distance + distance / 3"
        @selection="select(i)"
      />
    </g>

    <g class="player-info" :transform="`translate(${settings.width / 3},${settings.height - 12})`">
      <text>
         <tspan v-for="(player,i) in settings.players" :class="{ 'current-player': i === currentPlayer }"> {{ player }} </tspan>
      </text>
      <line :x1="-settings.width/5" :x2="settings.width/5" y1="10" y2="10" :stroke="playerColors[currentPlayer]" />
    </g>

    <g @click="finishRound()" :transform="`translate(${settings.width - 300},${settings.height - 32})`">
      <svg-button label="finish round" v-if="mode === 'conquer'" />
      <svg-button :label="`spend ${points[currentPlayer]} points`" v-else-if="points[currentPlayer] > 0" />
      <svg-button label="next player" v-else />
    </g>
  </svg>
</template>

<script>
import Citadel from './Citadel'
import SvgButton from './Button'
import {
  populateField, neighbours, conquer,
  PLAYER_COLORS, STANDARD_VOLUME, EXTENDED_VOLUME, EXTENDED_VOLUME_DECAY
} from './tools'

export default {
  name: 'citadels-field',
  props: [ 'settings' ],
  components: { Citadel, SvgButton },
  data () {
    return {
      playerColors: PLAYER_COLORS,
      distance: 80,
      citadels: [],
      currentPlayer: 0,
      selection: null,
      neighbours: [],
      mode: 'conquer', // 'conquer' or 'recharge'
      points: {}
    }
  },
  beforeMount () {
    this.settings.players.forEach((p,i) => {
      this.points[i] = 0
    })

    this.citadels = populateField(
      this.rows,
      this.columns,
      this.settings.players.length,
      this.settings.quickstart
    )
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
      else if (this.points[this.currentPlayer])
        return `spend ${this.points[this.currentPlayer]} points`
      else
        return 'next player'
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
      const ownedByPlayer = citadel.owner === this.currentPlayer

      if (this.mode === 'conquer') {
        const nothingSelected = this.selection === null
        const notSelection = this.selection !== i
        const hasValue = citadel.value > 1
        const canOverload = citadel.value >= STANDARD_VOLUME && citadel.value < EXTENDED_VOLUME
        const isNeighbour = this.neighbours.indexOf(i) >= 0

        // citadel of player activated
        if (nothingSelected && ownedByPlayer && hasValue) {
          this.reset()
          this.selection = i
          citadel.selected = true
          this.neighbours = neighbours(i, this.columns, this.citadels)
          this.neighbours.forEach(c => {
            const citadel  = this.citadels[c]
            citadel.highlighted = citadel.owner !== this.currentPlayer
          })

        // neighbouring citadel attacked
        } else if (notSelection && !ownedByPlayer && isNeighbour) {
          conquer(this.citadels[this.selection], this.citadels[i])
          this.reset()
          this.selection = null
          this.neighbours = []

        // citadel gets overloaded
        } else if (notSelection && ownedByPlayer && isNeighbour && canOverload) {
          const selection = this.citadels[this.selection]
          citadel.value += selection.value - 1
          selection.value = 1
          this.reset()
          this.selection = null
          this.neighbours = []

          if (citadel.value > EXTENDED_VOLUME) {
            selection.value += (citadel.value - EXTENDED_VOLUME)
            citadel.value = EXTENDED_VOLUME
          }

        } else if (!notSelection) {
          this.reset()
          this.selection = null
          this.neighbours = []
        }

      } else {
        const isNotFull = citadel.value < STANDARD_VOLUME

        if (ownedByPlayer && this.points[this.currentPlayer] > 0 && isNotFull) {
          citadel.value += 1
          this.points[this.currentPlayer] -= 1
          citadel.highlighted = citadel.value < STANDARD_VOLUME
        }
      }
    },
    finishRound () {
      this.reset()

      if (this.mode === 'conquer') {
        this.mode = 'recharge'

        for(let p in this.points) this.points[p] = 0
        this.citadels.forEach(c => {
          this.points[c.owner]++
          c.highlighted = c.owner === this.currentPlayer && c.value < STANDARD_VOLUME
        })

      } else {
        const decay = EXTENDED_VOLUME_DECAY
        this.currentPlayer = (this.currentPlayer + 1) % this.settings.players.length
        this.mode = 'conquer'

        // overloaded citadels loose value every round
        this.citadels.forEach(c => {
          if (c.owner === this.currentPlayer && c.value > STANDARD_VOLUME) {
            c.value -= (c.value - decay) % decay || decay
          }
        })
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
  #field text {
    stroke: none;
    fill: #CCC;
    font-size: 1.8rem;
    text-anchor: middle;
  }
  #field g.player-info > text > tspan {
    z-index: 0;
    opacity: .5;
    font-size: 1.4rem;
  }
  #field g.player-info > text > tspan.current-player {
    z-index: 1;
    opacity: 1;
    font-size: 2rem;
  }
  #field g.player-info > line {
    stroke-width: 3;
  }
</style>
