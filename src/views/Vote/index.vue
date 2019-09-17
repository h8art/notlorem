<template lang="pug">
.vote
  .header
    a-button(@click='$router.push("/votes")')
      a-icon(type='left')
      | Назад
    h2.title {{vote.title}}
    a-button.btn-close(@click='closeVote(vote.id)' v-if='vote.creator.id == 1' icon='close' type='danger')
  .body
    .info-block
      .block
        .block-header Создатель:
        .block-body 
          a-tag {{vote.creator.firstName + " " + vote.creator.lastName}}
      .block
        .block-header Участники:
        .block-body 
          a-tag(v-for='participant in vote.participantUsers') {{participant.firstName + " " + participant.lastName}}
      .block
        .block-header Описание:
        .block-body
          p {{vote.description}}
      .block
        .block-header Вложения:
        .block-body
          .doc(v-for='doc in vote.attachments' @click='openDoc(doc)')
            img(src='/docx_icon.png')
            .caption {{doc.title}}
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
                a-tag(v-if='getVoteStatus(topic)!=null' :color="getVoteStatus(topic)=='Положительное решение'?'green':getVoteStatus(topic)=='Отрицательное решение'?'red':'orange'") {{getVoteStatus(topic)}}
              .topic-line
                .topic-line-positive(:style='{ width: getWidth(topic.id, 1) + "%" }')
                .topic-line-netral(:style='{ width: getWidth(topic.id, 0) + "%" }')
                .topic-line-negative(:style='{ width: getWidth(topic.id, -1) + "%" }')
              .dis
                a-button-group
                  a-button(icon='dislike' @click='voteOnTopic(topic.id, -1)')
                  a-button(icon='question' @click='voteOnTopic(topic.id, 0)')
                  a-button(icon='like' @click='voteOnTopic(topic.id, 1)')
                a-divider(type='vertical')
                a-button-group
                  a-popover(title='Приложения')
                    //- template(slot='content')
                    //-   a(href='') Документ 1
                    a-button(icon='link')
                  a-button(@click='openDiscussion(topic.id)' type='primary' icon='message')
    .discussion(v-if='discussion')
      a-card.card(:title='discussion.title' :bodyStyle="{ flex: '1' }")
        .inner
          .inner-messages
            .message(v-for='message in discussion.messages' :class='{ "self": message.author.id == user.id, "nonself": message.author.id != user.id }')
              .message-text {{message.text}}
          .inner-chat
            a-divider
            a-textarea(:rows="4" @change="changeComment" :value="commentText")
            .inner-chat-actions
              a-button(icon="link")
              a-button(type='primary' @click='send(discussion.id)') Отправить
</template>
<script>
export default {
  data(){
    return {
      discussionId: null,
      vote: null,
      commentText: ''
    }
  },
  computed: {
    discussion() {
      return this.vote.topics.filter(t => t.id == this.discussionId)[0]
    },
    user(){
      return this.$store.state.user
    }
  },
  methods: {
    getVoteStatus(topic) {
      if(this.vote.participantUsers.length == topic.voices.length){
        const positiveCount = topic.voices.filter(v => v.decision == 1)
        const negativeCount = topic.voices.filter(v => v.decision == -1)
        const netralCount = topic.voices.filter(v => v.decision == 0)
        if(positiveCount>negativeCount&&positiveCount>netralCount) return 'Положительное решение'
        if(positiveCount<negativeCount&&negativeCount>netralCount) return 'Отрицательное решение'
        if(netralCount>negativeCount&&positiveCount<netralCount) return 'Решение не принято'
      }else return null
    },
    closeVote(id) {
      var query = `mutation CancelVote($voteId: Int) {
        cancelVote(voteId: $voteId) {
          id
        }
      }`;
      this.axios.post('/api', {
        query: query,
        variables: {
          voteId: parseInt(id)
        }
      }, {
          headers: { Authorization: "Bearer " + this.$store.state.jwt }
      }).then(() => {
        this.$route.push('/votes')
      })
    },
    getWidth(topicId, type){
      return (this.vote.topics.filter(t => t.id == topicId)[0].voices.filter(v => v.decision == type).length/this.vote.participantUsers.length) * 100
    },
    voteOnTopic(id, type){
      var query = `mutation CreateVoice($decision: Int, $topicId: Int) {
        createVoice(decision: $decision, topicId: $topicId) {
          decision
        }
      }`;
      this.axios.post('/api', {
        query: query,
        variables: {
          topicId: parseInt(id),
          decision: type
        }
      }, {
          headers: { Authorization: "Bearer " + this.$store.state.jwt }
      }).then(() => {
        this.getVote()
        this.commentText = ''
      })
    },
    send(id){
      var query = `mutation CreateMessage($text: String!, $topicId: Int!) {
        createMessage(text: $text, topicId: $topicId) {
          id
        }
      }`;
      this.axios.post('/api', {
        query: query,
        variables: {
          topicId: parseInt(id),
          text: this.commentText
        }
      }, {
          headers: { Authorization: "Bearer " + this.$store.state.jwt }
      }).then(() => {
        this.getVote()
        this.commentText = ''
      })
    },
    changeComment(e){
      this.commentText = e.target.value
    },
    openDiscussion(id){
      this.discussionId = id
    },
    openDoc(doc) {
      this.$store.commit('openDocPreview', doc)
    },
    getVote(){
      const query = `query votes {
        listVotes {
          id
          title
          attachments {
            title
            url
          }
          description
          participantUsers {
            avatar
            firstName
            id
            lastName
            middleName
          }
          state
          topics{
            id
            attachments{
              title
              url
            }
            messages {
              author {
                id
                firstName
                lastName
                middleName
              }
              text
            }
            title
            voices {
              decision
              voter {
                id
                firstName
                lastName
                middleName
              }
            }
          }
          creator {
            id
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
        this.vote = resp.data.data.listVotes.map(i => {
          i.key = i.id
          return i
        }).filter(i => i.id == this.$route.params.id)[0]
      })
      // this.vote = {
      //   id: "123",
      //   title: "Очень важноe голосование",
      //   attachments: [{
      //     id: "321",
      //     title: "ПНХ.docx",
      //     url: "http%3A%2F%2Fieee802%2Eorg%3A80%2Fsecmail%2FdocIZSEwEqHFr%2Edoc"
      //   }],
      //   creator: {
      //     first_name: "Artem",
      //     middle_name: "Michailovich",
      //     last_name: "Gershteyn",
      //     avatar: ""
      //   },
      //   description: "Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор Голосования за то что я пидор",
      //   participants: [{
      //     first_name: "Artem",
      //     middle_name: "Michailovich",
      //     last_name: "Gershteyn",
      //     avatar: ""
      //   },{
      //     first_name: "Rick",
      //     middle_name: "Roll",
      //     last_name: "Astley",
      //     avatar: ""
      //   }],
      //   deadline: new Date(),
      //   topics: [{
      //     title: "Почему я пидор Почему я пидор Почему я пидор Почему я пидор Почему я пидор Почему я пидор Почему я пидор Почему я пидор Почему я пидор?",
      //     id: '1818',
      //     messages: [{
      //       author: {
      //         id: 2,
      //         first_name: "Rick",
      //         middle_name: "Roll",
      //         last_name: "Astley",
      //         avatar: ""
      //       },
      //       text: "why are you gay",
      //       inserted_at: new Date()
      //     }, {
      //       author: {
      //         id: 1,
      //         first_name: "Artem",
      //         middle_name: "Michailovich",
      //         last_name: "Gershteyn",
      //         avatar: ""
      //       },
      //       text: "who is gay",
      //       inserted_at: new Date()
      //     }],
      //     voices: [{
      //       decision: 1,
      //       user: {
      //         first_name: "Artem",
      //         middle_name: "Michailovich",
      //         last_name: "Gershteyn",
      //         avatar: ""
      //       }
      //     }]
      //   },{
      //     title: "Почему ты пидор?",
      //     id: '1819',
      //     voices: [{
      //       user: {
      //         first_name: "Artem",
      //         middle_name: "Michailovich",
      //         last_name: "Gershteyn",
      //         avatar: ""
      //       }
      //     }]
      //   }]
      // }
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
    .btn-close
      margin-left: 10px
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
          margin-bottom: 16px
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
      min-height: 96px
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