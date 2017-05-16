<template>
  <new-game v-if="!running"
    :settings="settings"
    @connect="connect($event)"
    @start="start($event)"
    @signOn="signOn($event)"
  />
  <field v-else
    :settings="settings"
    @stop="stop()"
  />
</template>

<script>
import { genClientId, MAX_PLAYERS } from './tools'
import NewGame from './NewGame'
import Field from './Field'

export default {
  name: 'citadels',
  components: { NewGame, Field },
  props: [ 'hub' ],
  data () {
    return {
      clientId: this.hub.getUid(),
      hubPrefix: 'citadel/',
      gameState: null,
      players: null,
      gameOwner: false,
      running: false,

      settings: {
        width: 960,
        height: 600,
        quickstart: false,
        players: [],
        playerId: 0,
      }
    }
  },
  methods: {
    signOn (player) {
      if (this.running || this.settings.players.length >= MAX_PLAYERS) return
      console.log('OFFLINE SIGN ON', player)
      this.settings.players.push(player)
    },
    signOff (player) {
      console.log('OFFLINE SIGN OFF', player)
      const players = this.settings.players
      players.splice(players.indexOf(value), 1)
      this.settings.players = players
    },
    connect (payload) {
      const { recordId, playerName } = payload
      console.log('connecting to citadel/' + recordId.toUpperCase() + ' with player ' + playerName)

      this.hubPrefix += recordId.toUpperCase() + '/'

      this.players = this.hub.record.getList(this.hubPrefix + 'players')
      this.gameState = this.hub.record.getRecord(this.hubPrefix + 'state')

      this.players.subscribe(players => {
        const newPlayerList = []
        players.forEach(p => {
          console.log('loading player', p)
          const record = this.hub.record.getRecord(p)
          record.whenReady(r => {
            console.log('loaded player', p, r.get())
            newPlayerList.push(r.get('name'))
          })
        })

        this.settings.players = newPlayerList
        // this.settings.players.length = MAX_PLAYERS
      })
      this.gameState.subscribe(settings => {
        this.settings.quickstart = settings.quickstart
        this.running = settings.running
      })

      // first come first serve!
      if (this.players.isEmpty()) {
        this.gameOwner = true
        console.log('YEAH, GAME OWNER', playerName, this.clientId)
      }

      this.hub.record.getRecord(this.hubPrefix + this.clientId).whenReady(r => r.set('name', playerName))
      this.players.addEntry(this.hubPrefix + this.clientId)
    },
    start ({ quickstart, playerName }) {
      this.settings.quickstart = !!quickstart

      if (!this.gameState) { // offline mode
        this.settings.players.unshift(playerName)
        this.running = true
      } else {
        this.gameState.set({quickstart, running: true})
      }
    },
    stop () {
      if (!this.gameState) { // offline mode
        this.running = false
      } else {
        this.gameState.set('running', false)
      }
    }
  }
}
</script>

<style>
  html,body,#citadels {
    font: 10px monospace;
    line-height: 10px;
  }

  #citadels {
    width: 96rem;
    height: 60rem;
    margin: 3rem auto;
  }

  #citadels > button.finish-round {
    display: block;
    margin: auto;
  }
</style>
