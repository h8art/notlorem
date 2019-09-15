<template lang='pug'>
a-layout#components-layout-demo-custom-trigger
  DocPreview
  //- a-layout-sider(:trigger='null', collapsible='', v-model='collapsed' theme='light')
  //-   .logo
  //-   a-menu(:defaultSelectedKeys="['1']")
  //-     a-menu-item(key='1')
  //-       a-icon(type='file-text')
  //-       span Документы
  //-     a-menu-item(key='2' @click='')
  //-       a-icon(type='file-add')
  //-       span Добавить документ
  //-     //- a-menu-item(key='3')
  //-     //-   a-icon(type='upload')
  //-     //-     span nav 3
  a-layout
    a-layout-header.toolbar(style='background: #fff; padding: 0 16px')
      .logo
        img(src='/vtb_logo.svg')
      h3.title Голосование
      a-button.btn(type='primary' @click='openAdd') Добавить голосование
      .empty
      a-avatar(icon='user')
      //- a-icon.trigger(:type="collapsed ? 'menu-unfold' : 'menu-fold'", @click='()=> collapsed = !collapsed')
    a-layout-content(:style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }")
      router-view
</template>
<script>
import DocPreview from './components/DocPreview/index'

export default {
  components: {DocPreview},
  data(){
    return {
      collapsed: true,
    }
  },
  methods: {
    openAdd(){
      this.$router.push('/add')
    }
  }
}
</script>
<style lang="sass">
body
  font-family: 'Helvetica', 'Avenir', Helvetica, Arial, sans-serif!important
#app
  font-family: 'Helvetica', 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
#nav
  padding: 30px
  a
    font-weight: bold
    color: #2c3e50
    &.router-link-exact-active
      color: #42b983
#components-layout-demo-custom-trigger .trigger
  font-size: 18px
  line-height: 64px
  padding: 0 24px
  cursor: pointer
  transition: color .3s
#components-layout-demo-custom-trigger 
  height: 100vh
#components-layout-demo-custom-trigger .trigger:hover
  color: #1890ff
.toolbar
  display: flex
  align-items: center
  .title
    margin-left: 16px
    font-size: 22px
    padding-top: 22px
  .btn
    margin-left: 16px
    margin-top: 8px
  .empty
    flex: 1
#components-layout-demo-custom-trigger .logo
  height: 100%
  width: fit-content
</style>
