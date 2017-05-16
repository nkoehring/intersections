<template>
  <new-game v-model="settings" @connect="connect($event)" v-if="!settings.started" />
  <field :settings="settings" @stop="settings.started = false" v-else />
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
      record: null,

      settings: {
        started: false,
        width: 960,
        height: 600,
        quickstart: false,
        players: [],
        playerId: 0,
      }
    }
  },
  methods: {
    subscribe (name, callback) {
      this.hub.event.subscribe(this.hubPrefix + name, callback)
    },
    publish (name, action, value) {
      this.hub.event.emit(this.hubPrefix + name, {client: this.clientId, action, value})
    },
    connect (payload) {
      const { recordId, playerName } = payload
      console.log('connecting to citadel/' + recordId.toUpperCase() + ' with player ' + playerName)

      this.hubPrefix += recordId.toUpperCase() + '/'

      this.record = this.hub.record.get(this.hubPrefix + 'state')

      this.subscribe('player', data => {
        console.log('event player', data)
        const { client, action, value } = data

        if (client === this.clientId) return // ignore our own events
        if (action === 'sign-on') this.players.push(value)
      })

      this.publish('player', 'sign-on', playerName)
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
