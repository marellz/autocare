<template>
  <div class="flex flex-col h-screen min-h-screen overflow-auto">
    <header>
      <Container class="flex items-center space-x-4 py-4">
        <img alt="Vue logo" class="h-10 " src="@/assets/images/logo.svg" width="125" height="125" />
        <nav class="flex items-center space-x-2 flex-auto">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>

          <div class="!ml-auto flex space-x-2">
            <template v-if="auth.authenticated">
              <p>{{ auth.user?.name }}</p>
              <a href="#logout" @click.prevent="auth.logout">Logout</a>
            </template>
            <template v-else>
              <RouterLink to="/login">Login</RouterLink>
              <RouterLink to="/register">Register</RouterLink>
            </template>
          </div>
        </nav>
      </Container>
    </header>
    <main class="flex-auto py-10">
      <RouterView />
    </main>
    <footer></footer>
  </div>

</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Container from './components/base/container.vue';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore()

</script>