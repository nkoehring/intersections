<template>
  <div id="menu">
    <section class="settings player-name">
      <label for="player">Your Name</label>
      <input name="player" v-model.trim="playerName" />
    </section>
    <section class="settings record-id" v-if="!offlineMode">
      <label for="record-id">Game Name</label>
      <input name="record-id" type="text" pattern="[A-Za-z0-9_-]{3,23}" v-model.trim="recordId" />
      <button @click="$emit('connect', {recordId, playerName})" :disabled="playerName.length < 2 || recordId.length < 2">connect</button>
    </section>
    <button class="linkish" @click="offlineMode = !offlineMode">play {{ offlineMode ? 'on' : 'off' }}line</button>

    <div v-show="value.dataHub || offlineMode">
      <hr />
      <div id='waiting-message' v-show="!offlineMode && players.length < 1">waiting for other players to connect</div>
      <section class="settings" v-for="(player,i) in players">
        <label for="`player${i}`">Player {{i+2}}</label>
        <input name="`player${i}`" v-model.trim="players[i]" :disabled="!offlineMode" />
      </section>

      <button @click="opponents.push(randomName())" v-if="offlineMode && opponents.length < maxPlayers">add player</button>

      <section class="settings quickstart start">
        <label><input type="checkbox" v-model="quickstart" /> quick start</label>
        <button @click="startNewGame()" :disabled="playerName.length < 2 || players.length < 1">new game</button>
      </section>
    </div>
  </div>
</template>

<script>
import { MAX_PLAYERS, randomRecordId, randomName } from './tools'

export default {
  name: 'citadels-menu',
  props: [ 'value', 'hub' ],
  data () {
    return {
      playerName: randomName(),
      opponents: [], // for offline mode
      maxPlayers: MAX_PLAYERS,
      quickstart: false,
      offlineMode: false,
      recordId: randomRecordId()
    }
  },
  computed: {
    players () {
      return this.offlineMode ? this.opponents : this.value.players
    }
  },
  methods: {
    randomName,
    startNewGame () {
      const players = this.players.slice()
      players.unshift(this.playerName)

      this.$emit('input', Object.assign(this.value, {
        started: true,
        quickstart: this.quickstart,
        players
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
  #waiting-message {
    display: block;
    margin: 2em 0;
    font-size: 1em;
    line-height: 2em;
    transform: scale(0.2);
    animation: waiting-message 20s infinite alternate;
  }
  @keyframes waiting-message {
    0% { transform: scale(0.2); }
    10% { transform: scale(0.8); }
    100% { transform: scale(1.0); }
  }
</style>
