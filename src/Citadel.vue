<template>
  <g class="citadel" :class="{ selected, [`player${owner}`]: true }" @click="selection()" :transform="`translate(${x},${y})`">
    <polygon points="10,0 20,0 30,10 30,20 20,30 10,30 0,20 0,10">
    </polygon>
    <text x="9" y="22">{{ value }}</text>
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
      console.log('selection', this.owner)
      if (this.owner === 0) this.$emit('selection')
    }
  }
}
</script>

<style scoped>
  g.citadel { cursor: default; }
  g.citadel.player0 { cursor: pointer; }
  g.citadel > polygon {
    stroke: white;
    stroke-width: 2;
    fill: transparent;
  }
  g.citadel > text {
    stroke: none;
    fill: white;
    font-size: 2.0rem;
  }
  g.citadel.selected > polygon { fill: #282; }
  g.citadel.player0 > polygon { stroke: #AAF; }
  g.citadel.player1 > polygon { stroke: #AFA; }
</style>
