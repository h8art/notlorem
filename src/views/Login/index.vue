<template lang="pug">
.login
  .login-inner(v-if='!isRegister')
    h3 Вход
    a-form#components-form-demo-normal-login.login-form(:form='form', @submit='handleSubmit')
      a-form-item
        a-input(v-decorator="[\ 'userName',\ { rules: [{ required: true, message: 'Пожалуйста введте email!' }] }\ ]", placeholder='Username')
          a-icon(slot='prefix', type='user', style='color: rgba(0,0,0,.25)')
      a-form-item
        a-input(v-decorator="[\ 'password',\ { rules: [{ required: true, message: 'Please input your Password!' }] }\ ]", type='password', placeholder='Password')
          a-icon(slot='prefix', type='lock', style='color: rgba(0,0,0,.25)')
      a-button.login-form-button(type='primary', html-type='submit') Войти
      |       Или 
      a(@click='isRegister = true') зарегистрируйтесь
  .login-inner(v-else)
    h3 Регистрация
    .inp-bl
      span Email
      a-input(v-model='register.email' placeholder='Введите email' name='email')
    .inp-bl
      span ФИО
      a-input-group(compact)
        a-input(style='width: 33.34%' v-model='register.last_name' placeholder='Фамилия' name='last_name')
        a-input(style='width: 33.34%' v-model='register.first_name' placeholder='Имя' name='first_name')
        a-input(style='width: 33.34%' v-model='register.middle_name' placeholder='Отчество' name='middle_name')
    .inp-bl
      span Должность
      div
        a-select(placeholder='Выберите должность' :defaultActiveFirstOption="false" style="width: 100%" v-model='register.posId')
          a-select-option(v-for='pos in positions' :key='pos.id' :value='pos.id') {{pos.title}}
    .inp-bl
      span Пароль
      a-input(v-model='register.password' placeholder='Введите пароль' type='password')
    a-button.login-form-button(type='primary', @click='registerUser') Регистрация
</template>
<script>
export default {
  data(){
    return {
      positions: [],
      isRegister: false,
      register: {
        email: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        posId: '',
        password: '',
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  mounted(){
    this.getPositions()
  },
  methods: {
    getPositions() {
      var query = `query listPositions {
        listPositions {
          id
          title
        }
      }`;
      this.axios.post('/', {
        query: query,
      }).then((resp) => {
        this.positions = resp.data.data.listPositions
      })
    },
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          var queryLogin = `mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              jwt
            }
          }`;
          this.axios.post("/api", {
            query: queryLogin,
            variables: {
              email: values.userName,
              password: values.password
            }
          }).then(resp => {
            this.$store.commit('updateJWT', resp.data.data.login.jwt)
            this.$router.push('/votes')
          })
        }
      });
    },
    registerUser(){
      var query = `mutation CreateUser($email: String!, $firstName: String, $lastName: String, $middleName: String, $password: String!, $positionId: Int!) {
        createUser(email: $email, firstName: $firstName,lastName: $lastName, middleName: $middleName, password: $password, positionId: $positionId) {
          avatar
          firstName
          id
          lastName
          middleName
          position {
            title
            weight
          }
        }
      }`;
      this.axios.post('/api', {
        query: query,
        variables: {
          email: this.register.email,
          firstName: this.register.first_name,
          lastName: this.register.last_name,
          middleName: this.register.middle_name,
          password: this.register.password,
          positionId: parseInt(this.register.posId)
        }
      }).then(() => {
        var queryLogin = `mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            jwt
          }
        }`;
        this.axios.post("/api", {
          query: queryLogin,
          variables: {
            email: this.register.email,
            password: this.register.password
          }
        }).then((resp)=>{
          this.$store.commit('updateJWT', resp.data.data.login.jwt)
          this.$router.push('/votes')
        })
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.login
  height: 100%
  display: flex
  align-items: center
  justify-content: center
  .login-inner
    max-width: 350px
    .inp-bl
      margin-bottom: 8px
.login-form-button
  width: 100%
</style>