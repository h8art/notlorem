<template lang="pug">
  .list-cont
    a-menu(style='width: 256px; height: 100%;', :defaultSelectedKeys="['1']", :defaultOpenKeys="['sub1','sub2']", mode="inline")
      a-sub-menu(key='sub1')
        span(slot='title')
          a-icon(type='appstore')
          span Входящие
        a-menu-item(key='3') Черновик
        a-menu-item(key='4') 
          a-badge(count="5")
            span Согласование&nbsp;&nbsp;&nbsp;
        a-menu-item(key='5') Проверка состояния
      a-menu-item(key='1')
        a-icon(type='mail')
        | Исходящие
      a-sub-menu(key='sub2')
        span(slot='title')
          a-icon(type='setting')
          span Архив
        a-menu-item(key='7') Входящие
        a-menu-item(key='8') Исходящие
    .table
      .filters
        h3 Фильтры: 
        a-select.filter(defaultValue='filter1')
          a-select-option(value='filter1') Фильтер 1
        a-select.filter(defaultValue='filter1')
          a-select-option(value='filter1') Фильтер 1
      a-table(:columns='columns', :dataSource='votes', @change='onChange', :pagination='false')
        span(slot="creator" slot-scope="obj") {{obj.first_name + " " + obj.last_name}}
        span(slot="deadline" slot-scope='text') {{formatDate(text)}}
  //- a-list(:dataSource='votes')
  //-   a-list-item(slot='renderItem', slot-scope='item, index')
  //-     a-list-item-meta(:description='item.description')
  //-       router-link(slot='title', :to='"/vote/" + item.id') {{item.title}}
  //-     router-link(:to='"/vote/" + item.id' slot="actions") Просмотр
  //-     div 

  //-       a-divider(type='vertical')
      //- router-link(:to='`/vote/${item.id}`')
      //-   a-card.card(:title='item.title')
      //-     .card_row
      //-       .card_row_title Описание:
      //-       p.card_row_text {{item.description}}
      //-     .card_row
      //-       .card_row_title Пункты:
      //-       ul.topic
      //-         li.topic_title(v-for='topic in item.topics') {{topic.title}}
      //-     template(slot='actions')
</template>
<script>
import { format } from 'date-fns'
const columns = [{
  title: 'Название',
  dataIndex: 'title',
  sorter: (a, b) => a.title.length - b.title.length,
}, {
  title: 'Создатель',
  dataIndex: 'creator',
  scopedSlots: { customRender: 'creator' },
  sorter: (a, b) => (a.creator.first_name + " " + a.creator.last_name).length - (b.creator.first_name + " " + b.creator.last_name).length,
}, {
  title: 'Дедлайн',
  dataIndex: 'deadline',
  scopedSlots: { customRender: 'deadline' },
  sorter: (a, b) => new Date(b.deadline) - new Date(a.deadline),
}];



function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

export default {
  data() {
    return {
      columns,
      votes: []
    }
  },
  mounted(){
    this.getVotes()
  },
  methods: {
    formatDate(date){
      return format(date, 'dd.MM.yyyy')
    },
    getVotes(){
      const query = `query votes {
        listVotes {
          id
          title
          creator {
            firstName
            lastName
            middleName
          }
          deadline
        }
      }`
      this.axios.post('/api', {
        query: query,
      }, {
          headers: { Authorization: "Bearer " + this.$store.state.jwt }
      }).then((resp) => {
        this.votes = resp.data.data.listVotes
      })
    },
    onChange,
  },
}
</script>
<style lang="sass" scoped>
.list-cont
  overflow: auto
  height: 100%
  display: flex
  .table
    flex: 1
    .filters
      padding: 8px 16px
      margin-bottom: 16px
      .filter
        margin-right: 8px
.card
  transition: all .3s
  &:hover
    cursor: pointer
    transform: scale(1.05)
.card_row
  &_title
    font-size: 12px
    margin-bottom: 8px
    font-weight: bold
  &_text
    font-size: 11px
.topic
  &_title
    font-size: 11px
</style>