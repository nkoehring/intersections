<template>
  <svg id="field" viewBox='0 0 960 600' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
    <citadel v-for="(c,i) in citadels"
      :key="i"
      :value="c.value"
      :selected="c.selected"
      :owner="c.owner"
      :x="(i % columns) * distance + distance / 1.2"
      :y="Math.floor(i / columns) * distance + distance / 2"
      @selection="select(i)"
    />
  </svg>
</template>

<script>
import Citadel from './Citadel'

export default {
  name: 'citadels-field',
  components: { Citadel },
  data () {
    return {
      distance: 80,
      citadels: []
    }
  },
  beforeMount () {
    let i = this.rows * this.columns
    for(; i; i--)
      this.citadels.push({ value: Math.floor(Math.random() * 10), selected: false, owner: Math.round(Math.random()) })
  },
  computed: {
    columns () {
      return Math.floor(960 / this.distance) - 1
    },
    rows () {
      return Math.floor(600 / this.distance)
    }
  },
  methods: {
    select (i) {
      this.citadels.forEach((c, j) => {
        c.selected = i === j
      })
    }
  }
}
</script>

<style>
  #field {
    display: block;
    width: 100%;
    height: 100%;
    background: black;
  }
</style>
