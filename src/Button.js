export default {
  functional: true,
  name: 'button',
  props: ['label', 'width'],
  render (h, ctx) {
    const width = ctx.props.width || 200
    return h('g', {'class':'button'}, [
      h('rect', { attrs: {x:0, y:0, width, height:30, rx:15, ry:15} }),
      h('text', { attrs: {x:width / 2, y:22} }, [ctx.props.label])
    ])
  }
}
