export default {
  name: 'button',
  props: ['label'],
  render (h) {
    return h('g', {'class':'button'}, [
      h('rect', { attrs: {x:0, y:0, width:200, height:30, rx:15, ry:15} }),
      h('text', { attrs: {x:100, y:22} }, [this.label])
    ])
  }
}
