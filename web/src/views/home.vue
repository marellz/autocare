<template>
  <Container>
    <template v-if="auth.authenticated">
      <h1 class="title">Welcome back, {{ userName }}</h1>

      <h1>Dashboard here</h1>

    </template>
    <template v-else>
      

      <div class="mt-10 flex items-center space-x-4">
        <RouterLink to="/login">
          <Button type="button">
            <span>Login</span>
          </Button>
        </RouterLink>
        <RouterLink to="/register">
          <Button type="button">
            <span>Register</span>
          </Button>

        </RouterLink>
      </div>
    </template>
  </Container>
</template>

<script setup lang="ts">
import Container from '@/components/base/container.vue';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
const auth = useAuthStore()
const userName = computed(() => auth.authenticated ? auth.user?.name.split(' ')[0] : '')
import Button from '@/components/ui/button/Button.vue';
</script>