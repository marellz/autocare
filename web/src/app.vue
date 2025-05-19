<template>
  <div class="flex flex-col h-screen min-h-screen overflow-auto">
    <header>
      <Container class="py-4">
        <NavigationMenu>
          <NavigationMenuList>
            <template v-for="({ path, label, asBtn }, index) in links" :key="index">
              <RouterLink v-if="asBtn" :to="path">
                <Button >{{label}}</Button>
              </RouterLink>
              <NavigationMenuItem v-else>
                <NavigationMenuLink tag="router-link" :href="path">
                  {{ label }}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </template>
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

const auth = useAuthStore()
const links = [
  { path: '/', label: 'Requests' },
  { path: '/request-form', label: 'Make a request', asBtn: true },
]
</script>