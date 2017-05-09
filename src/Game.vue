<template>
  <div id="game">
    <new-game v-model="settings" v-if="!settings.started" />
    <field :settings="settings" v-if="settings.started" />
  </div>
</template>

<script>
import NewGame from './NewGame'
import Field from './Field'

export default {
  name: 'citadels',
  components: { NewGame, Field },
  data () {
    return {
      settings: {
        started: true,
        player: 'Anon McNoface',
        opponents: 1,
        maxOpponents: 3
      }
    }
  }
}
</script>

<style>
  html,body,#game {
    font: 10px monospace;
    line-height: 10px;
  }

  #game {
    width: 96rem;
    height: 60rem;
    border: .1rem dotted #333;
    margin: 3rem auto;
  }
</style>
