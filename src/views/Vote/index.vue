<template lang="pug">
.vote
  .header
    a-button
      a-icon(type='left')
      | Назад
    h2.title {{vote.title}}
  .body
    .info-block
      .block
        .block-header Создатель:
        .block-body 
          a-tag {{vote.creator.first_name + " " + vote.creator.last_name}}
      .block
        .block-header Участники:
        .block-body 
          a-tag(v-for='participant in vote.participants') {{participant.first_name + " " + participant.last_name}}
      .block
        .block-header Описание:
        .block-body
          p {{vote.description}}
      .block
        .block-header Вложения:
        .block-body
          .doc(v-for='doc in vote.attachments' @click='openDoc(doc)')
            img(src='/docx_icon.png')
            .caption doc.title
      .block
        .block-header 
        .block-body
    .topics
      .block
        .block-header Обсуждения:
        .block-body
          .topics-inner
            .topic(v-for='topic in vote.topics')
              .topic-header
                .topic-header-title {{topic.title}}
              .topic-line
                .topic-line-positive(:style='{ width: "15%" }')
                .topic-line-netral(:style='{ width: "20%" }')
                .topic-line-negative(:style='{ width: "10%" }')
              .dis
                a-button-group
                  a-button(icon='dislike')
                  a-button(icon='question')
                  a-button(icon='like')
                a-divider(type='vertical')
                a-button-group
                  a-popover(title='Приложения')
                    template(slot='content')
                      a(href='') Документ 1
                    a-button(icon='link')
                  a-badge(count="5")
                    a-button(@click='openDiscussion(topic.id)' type='primary' icon='message')
    .discussion(v-if='discussion')
      a-card.card(:title='discussion.title' :bodyStyle="{ flex: '1' }")
        .inner
          .inner-messages
            .message(v-for='message in discussion.messages' :class='{ "self": message.author.id == user.id, "nonself": message.author.id != user.id }')
              .message-text {{message.text}}
          .inner-chat
            a-divider
            a-textarea(:rows="4" @change="handleChange" :value="value")
            .inner-chat-actions
              a-button(icon="link")
              a-button(type='primary') Отправить
</template>
<script>
export default {
  data(){
    return {
      discussion: null,
      vote: null
    }
  },
  computed: {
    user(){
      return this.$store.state.user
    }
  },
  methods: {
    openDoc(doc) {
      this.$store.commit('openDocPreview', doc)
    },
    openDiscussion(id){
      this.discussion = this.vote.topics.filter(t => t.id == id)[0]
    },
    getVote(){
      this.vote = {
        id: "123",
        title: "Очень важноe голосование",
        attachments: [{
          id: "321",
          title: "ПНХ.docx",
          url: "http%3A%2F%2Fieee802%2Eorg%3A80%2Fsecmail%2FdocIZSEwEqHFr%2Edoc"
        }],
        creator: {
          first_name: "Artem",
          middle_name: "Michailovich",
          last_name: "Gershteyn",
          avatar: ""
        },
        description: "Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор",
        participants: [{
          first_name: "Artem",
          middle_name: "Michailovich",
          last_name: "Gershteyn",
          avatar: ""
        },{
          first_name: "Rick",
          middle_name: "Roll",
          last_name: "Astley",
          avatar: ""
        }],
        deadline: new Date(),
        topics: [{
          title: "Почему я пидор Почему я пидор Почему я пидор Почему я пидор Почему я пидор Почему я пидор Почему я пидор Почему я пидор Почему я пидор?",
          id: '1818',
          messages: [{
            author: {
              id: 2,
              first_name: "Rick",
              middle_name: "Roll",
              last_name: "Astley",
              avatar: ""
            },
            text: "why are you gay",
            inserted_at: new Date()
          }, {
            author: {
              id: 1,
              first_name: "Artem",
              middle_name: "Michailovich",
              last_name: "Gershteyn",
              avatar: ""
            },
            text: "who is gay",
            inserted_at: new Date()
          }],
          voices: [{
            decision: 1,
            user: {
              first_name: "Artem",
              middle_name: "Michailovich",
              last_name: "Gershteyn",
              avatar: ""
            }
          }]
        },{
          title: "Почему ты пидор?",
          id: '1819',
          voices: [{
            user: {
              first_name: "Artem",
              middle_name: "Michailovich",
              last_name: "Gershteyn",
              avatar: ""
            }
          }]
        }]
      }
    }
  },
  mounted(){
    this.getVote()
  }
}
</script>
<style lang="sass" scoped>
.dis
  display: flex
  justify-content: center
  align-items: center
  margin: 16px 0
.comm
  display: flex
  justify-content: flex-end
.vote
  height: 100%
  display: flex
  flex-direction: column
  .header
    display: flex
    align-items: center
    margin-bottom: 16px
    h2
      margin-left: 16px
      margin-block-end: 0
      margin-block-start: 0
.discussion
  width: 45%
  .card
    height: 100%
    display: flex
    flex-direction: column
    .inner
      height: 100%
      display: flex
      flex-direction: column
      &-messages
        flex: 1
        display: flex
        flex-direction: column
        .message
          width: fit-content
          padding: 8px 16px
        .self
          align-self: flex-end
          background: #5B90C2
          color: #fff
          border-radius: 10px
          border-bottom-right-radius: 0
        .nonself
          align-self: flex-start
          background: #F4F4F4
          border-radius: 10px
          border-bottom-left-radius: 0
      &-chat
        &-actions
          display: flex
          justify-content: space-between
          margin-top: 8px
.title
  font-size: 28px
  margin-bottom: 20px
.body
  display: flex
  flex: 1
.info-block
  width: 25%
.topics
  width: 25%
  margin: 0 2.5%
.block
  margin-bottom: 16px
  &-header
    font-size: 16px
    font-weight: bold
    margin-bottom: 8px
  &-body
    .topics-inner
      border: 1px solid #D9D9D9
      border-radius: 5px
      .topic
        padding: 8px 16px
        border-bottom: 1px solid #D9D9D9
        &:last-child
          border-bottom: none
        &-header
          display: flex
          justify-content: space-between
          align-items: center
          &-title
          &-attach
        &-line
          margin-top: 8px
          height: 10px
          border-radius: 5px
          background: #EBEDF0
          display: flex
          overflow: hidden
          &-positive
            background: #70C040
            height: 100%
          &-netral
            background: #F0AF41
            height: 100%
          &-negative
            background: #E33C39
            height: 100%
            border-top-right-radius: 5px
            border-bottom-right-radius: 5px
    .doc
      width: 96px
      height: 96px
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      border: 1px solid #D9D9D9
      border-radius: 5px
      transition: background .3s
      &:hover
        cursor: pointer
        background: #FAFAFA
      img
        margin-right: 11px
        width: 64px
      .caption
        margin-top: 4px
        text-align: center
</style>