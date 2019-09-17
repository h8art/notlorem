<template lang="pug">
  .list-cont
    a-menu(style='width: 256px; height: 100%;', :defaultSelectedKeys="[]", :defaultOpenKeys="['sub1','sub2']", mode="inline")
      a-sub-menu(key='sub1')
        span(slot='title')
          a-icon(type='appstore')
          span Входящие
        //- a-menu-item(key='3') Черновик
        a-menu-item(key='4' @click='$router.push("/votes?filter=sogl")') 
          a-badge(:count="soglVotesLng")
            span Согласование&nbsp;&nbsp;&nbsp;
        a-menu-item(key='5' @click='$router.push("/votes?filter=check")') Проверка состояния
      a-menu-item(key='1' @click='$router.push("/votes?filter=sent")')
        a-icon(type='mail')
        | Исходящие
      a-sub-menu(key='sub2')
        span(slot='title')
          a-icon(type='setting')
          span Архив
        a-menu-item(key='7' @click='$router.push("/votes?filter=archiveInbox")') Входящие
        a-menu-item(key='8' @click='$router.push("/votes?filter=archiveSent")') Исходящие
    .table
      .filters
        h3 Фильтры: 
        a-select.filter(defaultValue='Кто участвует' placeholder='Участники')
          a-select-option(value='filter1') Фильтер 1
        a-range-picker(@change="onChange")
      a-table(:columns='columns', :dataSource='filteredVotes', @change='onChange', :pagination='false')
        span(slot="creator" slot-scope="obj") {{obj.firstName + " " + obj.lastName}}
        span(slot="deadline" slot-scope='text') {{formatDate(text)}}
        a-tag(slot='state' slot-scope="state, obj") {{getState(obj)}}
        div(slot='operation'  slot-scope="obj" )
          router-link(v-if='inArchiveInbox(obj.id)' :to='"/vote/" + obj.id') Возобновить
          a-divider(v-if='inArchiveInbox(obj.id)' type='vertical')
          router-link(:to='"/vote/" + obj.id') Просмотр
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
},{
  title: 'Статус',
  dataIndex: 'state',
  scopedSlots: { customRender: 'state' },
}, {
  title: 'Дедлайн',
  dataIndex: 'deadline',
  scopedSlots: { customRender: 'deadline' },
  sorter: (a, b) => new Date(b.deadline) - new Date(a.deadline),
},
  { title: 'Действие', key: 'operation', scopedSlots: { customRender: 'operation' } },
  ];



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
  computed: {
    soglVotesLng(){
      return this.votes.filter(v => v.state=='ongoing'&&v.creator.id!=1).length
    },
    archiveInbox(){
      return this.votes.filter(v => v.state!='ongoing'&&v.participantUsers.map(p => parseInt(p.id)).indexOf(1)>-1)
    },
    filteredVotes(){
      const filter = this.$route.query.filter
      switch (filter){
        case 'sogl':
          return this.votes.filter(v => v.state=='ongoing'&&v.creator.id!=1)
        case "sent":
          return this.votes.filter(v => v.state=='ongoing'&&v.creator.id==1)
        case "check":
          return this.votes.filter(v => v.state=='ongoing'&&v.topics.map(t => t.voices.map(vs => vs.voter.id).includes(1)).filter(z => z==true).length == v.topics.length)
        case 'archiveInbox':
          return this.votes.filter(v => v.state!='ongoing'&&v.creator.id!=1)
        case 'archiveSent':
          return this.votes.filter(v => v.state!='ongoing'&&v.creator.id==1)
        default:
          return this.votes
      }
    }
  },
  methods: {
    getState(obj) {
      if(obj.state=='ongoing') return 'На согласовании'
      if(obj.state=='cancelled') return 'Отменено'
      if(obj.state=='undecided') return 'Раздельное решение'
      if(obj.state=='finished') return 'Решение большинства'
    },
    inArchiveInbox(id){
      const filter = this.$route.query.filter
      if(filter&&filter=="archiveSent"){
        return this.votes.filter(v => v.id==id&&v.state!='ongoing'&&v.creator.id==1).length>0
      }
      
    },
    selectRow(select){
      console.log(select)
    },
    formatDate(date){
      return format(new Date(date), 'dd.MM.yyyy')
    },
    getVotes(){
      const query = `query votes {
        listVotes {
          id
          title
          state
          participantUsers {
            id
          }
          creator {
            id
            firstName
            lastName
            middleName
          }
          topics {
            voices {
              voter {
                id
              }
            }
          }
          deadline
        }
      }`
      this.axios.post('/api', {
        query: query,
      }, {
          headers: { Authorization: "Bearer " + this.$store.state.jwt }
      }).then((resp) => {
        this.votes = resp.data.data.listVotes.map(i => {
          i.key = i.id
          return i
        })
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