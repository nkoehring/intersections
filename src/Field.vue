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

    <g class="finish-round" @click="finishRound()">
      <rect
        :x="settings.width / 2 - 100"
        :y="settings.height - 32"
        width="200"
        height="30"
        rx="15"
        ry="15"
      />
      <text :x="settings.width / 2 - 60" :y="settings.height - 11">finish round</text>
    </g>
  </svg>
</template>

<script>
import Citadel from './Citadel'
import { populateField, neighbours, conquer } from './tools'

export default {
  name: 'citadels-field',
  props: [ 'settings' ],
  components: { Citadel },
  data () {
    return {
      distance: 80,
      citadels: [],
      selection: null,
      neighbours: []
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
      this.reset()

      if (this.selection === null && this.citadels[i].owner === 0 && this.citadels[i].value > 1) {
        this.selection = i
        this.citadels[i].selected = true
        this.neighbours = neighbours(i, this.columns, this.citadels)
        this.neighbours.forEach(c => this.citadels[c].highlighted = true)

      } else if (this.neighbours.indexOf(i) >= 0) {
        conquer(this.citadels[this.selection], this.citadels[i])
        this.selection = null
        this.neighbours = []
      }
    },
    finishRound () {
      const energy = this.citadels.filter(c => c.owner === 0).length
      console.log(energy)
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

  #field > g.finish-round { cursor: pointer; }
  #field > g.finish-round:hover > rect { stroke-width: 2; }
  #field > g.finish-round:hover > text { fill: #FFF; }
  #field > g.finish-round > rect {
    stroke: #ccc;
    fill: transparent;
  }
  #field > g.finish-round > text {
    stroke: none;
    fill: #CCC;
    font-size: 1.8rem;
  }
</style>
