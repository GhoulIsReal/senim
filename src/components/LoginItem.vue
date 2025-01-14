<script setup>
import { signIn } from '@/api'
import EmailIcon from './icons/EmailIcon.vue'
import PasswordIcon from './icons/PasswordIcon.vue'
import { InputGroup, InputGroupAddon, InputText, Password, Button } from 'primevue'
import { ref } from 'vue'
import KmgLogoIcon from './icons/KmgLogoIcon.vue'

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const { data } = await signIn({
      email: email.value,
      password: password.value,
    })
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token)
      location.reload()
    }
  } catch (error) {
    alert(error)
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleLogin">
    <KmgLogoIcon />
    <InputGroup>
      <InputGroupAddon>
        <EmailIcon />
      </InputGroupAddon>
      <InputText v-model="email" placeholder="Почта" />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <PasswordIcon />
      </InputGroupAddon>
      <Password v-model="password" placeholder="Пароль" />
    </InputGroup>
    <Button type="submit">Войти</Button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
  width: 350px;
  height: calc(100vh - 4rem);
}

.login-form > button {
  width: 100%;
}
</style>
