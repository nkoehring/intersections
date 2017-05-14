<template>
  <div id="menu">
    <section class="settings player-name">
      <label for="player0">Your Name</label>
      <input name="player0" v-model.trim="players[0]" />
    </section>
    <section class="settings record-id" v-if="!offlineMode">
      <label for="record-id">Game Name</label>
      <input name="record-id" type="text" pattern="[A-Za-z0-9_-]{3,23}" v-model.trim="recordId" />
      <button @click="connect()" :disabled="players[0].length < 2">connect</button>
    </section>
    <button class="linkish" @click="offlineMode = !offlineMode">play {{ offlineMode ? 'on' : 'off' }}line</button>

    <div v-show="value.recordId || offlineMode">
      <hr />
      <section class="settings" v-for="(player,i) in players.slice(1)">
        <label for="`player${i+1}`">Player {{i+2}}</label>
        <input name="`player${i+1}`" v-model.trim="players[i+1]" :disabled="!offlineMode" />
      </section>

      <button @click="players.push(randomName())" v-if="players.length < maxPlayers">add player</button>

      <section class="settings quickstart start">
        <label><input type="checkbox" v-model="quickstart" /> quick start</label>
        <button @click="startNewGame()" :disabled="players.length < 2">new game</button>
      </section>
    </div>
  </div>
</template>

<script>
import { MAX_PLAYERS, randomRecordId, randomName } from './tools'

export default {
  name: 'citadels-menu',
  props: [ 'value' ],
  data () {
    return {
      players: [randomName()],
      maxPlayers: MAX_PLAYERS,
      quickstart: false,
      offlineMode: false,
      recordId: randomRecordId()
    }
  },
  beforeMount () {
  },
  methods: {
    randomName,
    startNewGame () {
      this.$emit('input', Object.assign(this.value, {
        started: true,
        players: this.players,
        quickstart: this.quickstart
      }))
    },
    connect () {
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
  section.settings { margin: 2rem 0; }

  section.settings > label, section.settings > div.label,
  section.settings > input, section.settings > div.input {
    display: inline-block;
    width: 30rem;
    margin: 0 .5em;
    background: #333;
    border: none;
    color: #EEE;
    border-bottom: .2rem dotted transparent;
  }
  section.settings > label, section.settings > div.label { text-align: right; font-weight: bold; }
  section.settings > input, section.settings > div.input { text-align: left; }
  section.settings > input:hover,
  section.settings > input:focus { border-bottom-color: #EEE; outline: none; }
  section.settings.record-id > input { text-transform: uppercase; }
  section.settings.quickstart > label { width: auto; }

  #menu button {
    display: block;
    width: 20%;
    height: 2em;
    margin: 2em auto;
    cursor: pointer;
  }
  #menu > button.linkish {
    border: none;
    background: transparent;
    text-decoration: underline;
    color: #EEE;
  }
</style>
