<template>
  <div class="text-center dark:text-white">
    <svg :class="[loaderClass]" class="loader inline-block h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
  </div>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    color?: string;
    loaderClass?: string;
  }>(),
  {
    color: "text-slate-200",
  }
);
</script>
<style scoped>
.loader {
  animation: loader 0.75s linear infinite;
}

@keyframes loader {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
