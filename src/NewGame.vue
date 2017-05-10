<template>
  <div id="menu">
    <section name="player-settings" class="settings">
      <label for="player">Player Name:</label>
      <input name="player" v-model="player" />
    </section>

    <section name="opponents-settings" class="settings">
      <label for="opponents">Number of opponents:</label>
      <input name="opponents" v-model="opponents" type="number" min="1" :max="value.maxOpponents" />
    </section>

    <section name="start" class="settings">
      <button @click="emitSettings">new game</button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'citadels-menu',
  props: [ 'value' ],
  data () {
    return {
      player: '',
      opponents: 1
    }
  },
  beforeMount () {
    this.player = this.value.player
    this.opponents = this.value.opponents
  },
  methods: {
    emitSettings () {
      this.$emit('input', Object.assign(this.value, {
        started: true,
        player: this.player,
        opponents: this.opponents
      }))
    }
  }
}
</script>

<style scoped>
  #menu {
    padding-top: 10rem;
  }
  #menu, .settings > input, .settings > button {
    font-size: 2rem;
    text-align: center;
  }
  section.settings {
    margin: 2rem 0;
  }
  section.settings > button {
    display: block;
    width: 20%;
    height: 2em;
    margin: 2em auto;
  }
  section.settings > input[name="player"] {
    width: 25rem;
  }
  section.settings > input[name="opponents"] {
    width: 15rem;
  }
</style>
