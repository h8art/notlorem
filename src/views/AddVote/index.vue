<template lang="pug">
  .add
    h2 Добавить голосование
    a-divider
    a-form(:form='form', @submit='handleSubmit')
      a-form-item(label='Названиие', :label-col='{ span: 5 }', :wrapper-col='{ span: 12 }')
        a-input(placeholder='Название' v-decorator="[\'title',\{rules: [{ required: true, message: 'Введите Названиие!' }]}\]")
      a-form-item(label='Описание', :label-col='{ span: 5 }', :wrapper-col='{ span: 12 }')
        a-textarea(placeholder='Описание' v-decorator="[\'description',\{rules: [{ required: true, message: 'Введите Описание!' }]}\]")
      a-form-item(label='Дедлайн', :label-col='{ span: 5 }', :wrapper-col='{ span: 12 }')
        a-date-picker(v-decorator="[\'deadline',\{rules: [{ required: true, message: 'Выберете дату дедлайна!' }]}\]" placeholder='Выберите дату')
      a-form-item(label='Участники', :label-col='{ span: 5 }', :wrapper-col='{ span: 12 }')
        a-select( mode="multiple" v-decorator="[\'participants',\{rules: [{ required: true, message: 'Выберете участников!' }]}\]", placeholder='Выберете участников')
          a-select-option(:value='user.id' v-for='user in participantsList') {{user.firstName + " " + user.lastName}}
      a-form-item(:label-col='{ span: 5 }', :wrapper-col='{ span: 12 }' label='Вложения')
        a-upload-dragger(:beforeUpload="beforeUpload" v-decorator="['attachments', {\valuePropName: 'fileList',\getValueFromEvent: normFile,\}]", name='files')
          p.ant-upload-drag-icon
            a-icon(type='inbox')
          p.ant-upload-text
            | Нажмите или перетащите документы
          p.ant-upload-hint
            | Поддерживает загруку нескольких файлов одновременно
      .addTopic
        .topic(v-for='topic, ind in vote.topics')
          a-input(v-model='topic.title' placeholder='Введите названиие пункта')
          a-upload-dragger(:beforeUpload="(file) => beforeUploadTopic(ind, file)", name='files')
            p.ant-upload-drag-icon
              a-icon(type='inbox')
            p.ant-upload-text
              | Нажмите или перетащите документы
            p.ant-upload-hint
              | Поддерживает загруку нескольких файлов одновременно
        a-button(type='primary' @click='addTopic') + Добавить пункт голосования
      a-form-item(:wrapper-col='{ span: 12, offset: 5 }')
        a-button(type='primary', html-type='submit') Создать
</template>
<script>
export default {
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted(){
    this.getUsers()
  },
  methods: {
    addTopic(){
      this.vote.topics.push({
        attachments: [],
        title: ''
      })
    },
    getUsers(){
      var query = `query users {
        listUsers {
          id
          firstName
          lastName
        }
      }`;
      this.axios.post('/api', {
        query: query,
      }, {
          headers: { Authorization: "Bearer " + this.$store.state.jwt }
      }).then((resp) => {
        this.participantsList = resp.data.data.listUsers
      })
    },
    beforeUpload(file) {
      let fileList = this.form.getFieldValue("attachments")
      if(fileList==undefined){
        this.form.setFieldsValue({"attachments": [{
          title: file.name,
          file: file
        }]})
      }else {
        this.form.setFieldsValue({"attachments": [...fileList, {
          title: file.name,
          file: file
        }]})
      }
      
      return false;
    },
    beforeUploadTopic(ind, file) {
      let fileList = this.vote.topics[ind].attachments
      if(fileList==undefined){
        this.vote.topics[ind].attachments = [file]
      }else {
        this.vote.topics[ind].attachments = [...fileList, file]
      }
      return false;
    },
    handleSubmit(e){
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let payload = values
          payload.topics = this.vote.topics
          var query = `mutation CreateVote($attachments: attach, $deadline: dead, $desc: desc, $title: title, $topics: topics, $userIds: userIds) {
            createVote(attachments: $attachments, deadline: $dead, description: $desc, title: $title, topics: $topics, participants: $userIds) {
              id
            }
          }`;
          console.log(payload)
          this.axios.post('/api', {
            query: query,
            variables: {
              attach: payload.attachments,
              dead: payload.deadline.toISOString(),
              desc: payload.description,
              title: payload.title,
              topics: payload.topics,
              userIds: payload.participants.map(p => ({id: p}))
            }
          }).then(() => {
            // this.$router.push('/votes')
          })
          console.log('Received values of form: ', values);
        }
      });
    },
    normFile  (e) {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
  },
  data(){
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      },
      vote: {
        title: '',
        topics: [],
        attachments: [],
        participants: [],
        creator: null,
        deadline: null,
        description: ''
      },
      topicsList: [],
      participantsList: [],
    }
  }
}
</script>
<style lang="sass" scoped>

</style>