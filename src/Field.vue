<template>
  <svg id="field" :viewBox='`0 0 ${settings.width} ${settings.height}`' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
    <citadel v-for="(c,i) in citadels" v-if="c"
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
import { populateField } from './tools'

export default {
  name: 'citadels-field',
  props: [ 'settings' ],
  components: { Citadel },
  data () {
    return {
      distance: 80,
      citadels: []
    }
  },
  beforeMount () {
    this.citadels = populateField(this.rows, this.columns, this.settings.opponents + 1)
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
