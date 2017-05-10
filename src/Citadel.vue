<template>
  <g class="citadel" :class="{ selected, [`player${owner}`]: owner !== null}" @click="selection()" :transform="`translate(${x},${y})`">
    <polygon points="10,0 20,0 30,10 30,20 20,30 10,30 0,20 0,10" />
    <text x="9" y="22.5">{{ value }}</text>
  </g>
</template>

<script>
export default {
  name: 'citadels-intersection',
  props: [ 'owner', 'value', 'selected', 'x', 'y' ],
  data () {
    return {}
  },
  methods: {
    selection () {
      if (this.owner === 0) this.$emit('selection')
    }
  }
}
</script>

<style scoped>
  g.citadel { cursor: default; }
  g.citadel.player0 { cursor: pointer; }
  g.citadel > polygon {
    stroke: #888;
    stroke-width: 2;
    fill: transparent;
  }
  g.citadel > text {
    stroke: none;
    fill: white;
    font-size: 2.0rem;
  }
  g.citadel.selected > polygon { fill: #06F; }
  g.citadel.player0 > polygon { stroke: #06F; }
  g.citadel.player1 > polygon { stroke: #0F6; }
  g.citadel.player2 > polygon { stroke: #F60; }
  g.citadel.player3 > polygon { stroke: #60F; }
</style>
