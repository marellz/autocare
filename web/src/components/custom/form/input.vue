<template>
    <div class="space-y-2">
        <Label>{{ label }}</Label>
        <div>
            <Input v-model="model" />
            <span class="text-sm text-red-500" v-if="error">{{ error }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';

const model = defineModel<string|number>()
defineProps<{
    label?: string,
    error?: string
}>()
</script>