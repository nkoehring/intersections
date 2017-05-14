<template>
  <new-game v-model="settings" @connect="connect($event)" v-if="!settings.started" />
  <field :settings="settings" @stop="settings.started = false" v-else />
</template>

<script>
import NewGame from './NewGame'
import Field from './Field'

export default {
  name: 'citadels',
  components: { NewGame, Field },
  props: [ 'hub' ],
  data () {
    return {
      settings: {
        started: false,
        width: 960,
        height: 600,
        quickstart: false,
        players: [],
        playerId: 0,
        dataHub: null
      }
    }
  },
  methods: {
    connect (payload) {
      const { recordId, playerName } = payload
      console.log('connecting to citadel/' + recordId.toUpperCase() + ' with player ' + playerName)

      const record = this.hub.record.getRecord('citadel/' + recordId.toUpperCase())
      this.settings.dataHub = record

      console.log('players', record.get('players'))
      this.players = record.get('players') || []
      this.players.push(playerName)
      this.playerId = this.players.length - 1

      record.set('players', this.players)
      record.subscribe(data => {
        console.log('DATA UPDATE', data)
        this.players = data.players
      })

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
