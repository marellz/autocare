<template>
    <div class="space-y-2">
        <Label>{{ label }}</Label>
        <div>
            <Textarea v-model="model" />
            <span class="text-sm text-red-500" v-if="error">{{ error }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Label from '@/components/ui/label/Label.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';

const model = defineModel<string | number>()
defineProps<{
    label?: string,
    error?: string
}>()
</script>