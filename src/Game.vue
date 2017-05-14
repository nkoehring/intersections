<template>
  <new-game v-model="settings" v-if="!settings.started" />
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
        recordId: null,
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
