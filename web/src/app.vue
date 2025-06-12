<template>
  <div class="flex flex-col h-screen min-h-screen overflow-auto">
    <header>
      <Container class="py-4 flex items-center">
        <NavigationMenu>
          <NavigationMenuList class="space-x-4">
            <NavigationMenuItem v-for="({ path, label }, index) in links" :key="`links-${index}`">
              <RouterLink :to="path">
                {{ label }}
              </RouterLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu class="ml-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <RequestForm></RequestForm>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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
import NavigationMenu from './components/ui/navigation-menu/NavigationMenu.vue';
import NavigationMenuLink from './components/ui/navigation-menu/NavigationMenuLink.vue';
import NavigationMenuItem from './components/ui/navigation-menu/NavigationMenuItem.vue';
import NavigationMenuList from './components/ui/navigation-menu/NavigationMenuList.vue';
import Button from './components/ui/button/Button.vue';
import RequestForm from './components/partials/forms/request.form.vue'
const auth = useAuthStore()
const links = [
  { path: '/', label: 'Requests' },
  { path: '/dashboard/vendors', label: 'Vendors' },
]
// const actions = [
//   { path: '/request-form', label: 'Make a request' },
// ]
</script>