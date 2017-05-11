<template>
  <g class="citadel"
    :class="{ selected, highlighted, [`player${owner}`]: owner !== null}"
    @click="$emit('selection')" :transform="`translate(${x},${y})`"
  >
    <use xlink:href="#citadel-walls" filter="url(#grid-filter)" />
    <use xlink:href="#citadel-walls" />
    <text x="9" y="22.5">{{ value ? value : '' }}</text>
  </g>
</template>

<script>
export default {
  name: 'citadels-intersection',
  props: [ 'owner', 'value', 'selected', 'highlighted', 'x', 'y' ]
}
</script>

<style scoped>
  g.citadel { cursor: default; }
  g.citadel.player0 { cursor: pointer; }
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
  g.citadel.highlighted { cursor: pointer; }
  g.citadel.highlighted > use { fill: #336; stroke: #FFF; }

  g.citadel.player0 > use { stroke: #06F; }
  g.citadel.player1 > use { stroke: #0F6; }
  g.citadel.player2 > use { stroke: #F60; }
  g.citadel.player3 > use { stroke: #60F; }

  g.citadel.player0.selected > use { fill: #06F; }
  g.citadel.player1.selected > use { fill: #0F6; }
  g.citadel.player2.selected > use { fill: #F60; }
  g.citadel.player3.selected > use { fill: #60F; }

  g.citadel.player0.highlighted > use { stroke: #FFF; }
  g.citadel.player1.highlighted > use { stroke: #FFF; }
  g.citadel.player2.highlighted > use { stroke: #FFF; }
  g.citadel.player3.highlighted > use { stroke: #FFF; }

</style>
