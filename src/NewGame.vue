<template>
  <div id="menu">
    <section class="settings" :class="{active: players[i-1]}" v-for="i in maxPlayers">
      <label :for="`player${i}`">Player {{i}}:</label>
      <input :name="`player${i}`" v-model="players[i-1]" />
    </section>

    <button @click="emitSettings" :disabled="amountPlayers < 2">new game</button>
  </div>
</template>

<script>
import { MAX_PLAYERS } from './tools'

export default {
  name: 'citadels-menu',
  props: [ 'value' ],
  data () {
    return {
      players: new Array(MAX_PLAYERS),
      maxPlayers: MAX_PLAYERS
    }
  },
  beforeMount () {
    this.players = this.value.players
  },
  computed: {
    amountPlayers () {
      return this.players.filter(x => x).length
    }
  },
  methods: {
    emitSettings () {
      if (this.amountPlayers < 2) return

      this.$emit('input', Object.assign(this.value, {
        started: true,
        players: this.players.filter(x => x)
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
  section.settings { margin: 2rem 0; opacity: .7; }
  section.settings:hover, section.settings.active { margin: 2rem 0; opacity: 1; }
  section.settings > input { width: 25rem; }
  #menu > button {
    display: block;
    width: 20%;
    height: 2em;
    margin: 2em auto;
  }
</style>
