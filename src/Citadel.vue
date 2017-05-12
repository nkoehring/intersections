<template>
  <g class="citadel"
    :class="{ selected, highlighted, ownedByPlayer, owned: owner !== null}"
    @click="$emit('selection')" :transform="`translate(${x},${y})`"
  >
    <use xlink:href="#citadel-walls" :style="{stroke: color, fill, strokeWidth: highlighted ? value * 2 : value}" filter="url(#grid-filter)" />
    <use xlink:href="#citadel-walls" :style="{stroke: color, fill, strokeWidth: highlighted ? value * 2 : value}" />
    <use xlink:href="#citadel-walls" :style="{stroke: highlighted ? '#FFF' : color, fill, strokeOpacity: value ? value * 0.2 : 1}" />
    <text x="15" y="22.5">{{ value ? value : '' }}</text>
  </g>
</template>

<script>
import { PLAYER_COLORS } from './tools'

export default {
  name: 'citadels-intersection',
  props: [ 'owner', 'ownedByPlayer', 'value', 'selected', 'highlighted', 'x', 'y' ],
  computed: {
    color () { return PLAYER_COLORS[this.owner] },
    fill () {
      if (this.selected) return this.color
      if (this.highlighted) return '#666'
      return 'transparent'
    }
  }
}
</script>

<style scoped>
  g.citadel { cursor: default; }
  g.citadel.owned { opacity: .5; }
  g.citadel.ownedByPlayer { cursor: pointer; opacity: 1; }
  g.citadel > use {
    stroke: #888;
    stroke-width: 2;
    fill: transparent;
  }
  g.citadel > text {
    stroke: none;
    fill: white;
    font-size: 2.0rem;
  }
  g.citadel.highlighted > use { fill: #336; }

</style>
