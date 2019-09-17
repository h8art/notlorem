<template lang="pug">
a-drawer(width=640 :title='doc.title', placement='right', @close='close', :visible='isOpen' :wrapStyle="{ height: '100%' }")
  .inner
    iframe(:src='"https://view.officeapps.live.com/op/embed.aspx?src=" + "https://calibre-ebook.com/downloads/demos/demo.docx" ', width='100%', height='100%', frameborder='0')
    | This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
</template>
<script>
export default {
  methods: {
    close() {
      console.log('close plz')
      this.$store.commit('closeDocViewer')
    }
  },
  computed: {
    isOpen(){
      return this.$store.state.docViwerDrawer
    },
    doc() {
      return this.$store.state.actualDoc
    }
  }
}
</script>
<style lang="sass" scoped>
.inner
  height: calc(100vh - 55px)
</style>