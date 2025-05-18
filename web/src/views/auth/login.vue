<template>
    <div>
        <base-container>
            <h1 class="title">Login</h1>
            <div class="mt-10">
                <Form @submit="login()">
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <form-label>Email address</form-label>
                            <form-input v-model="email" :error="errors.email" autocomplete="email" type="email"
                                required></form-input>
                        </div>
                        <div class="space-y-2">
                            <form-label>Password</form-label>
                            <form-input v-model="password" autocomplete="password" :error="errors.password"
                                allow-password-toggle type="password" required></form-input>
                        </div>

                        <div v-if="responseError"
                            class="flex items-center space-x-3 border border-red-500 text-red-500 bg-red-500/10 rounded-lg p-2"
                            @click="responseError = ''">
                            <AlertCircle />
                            <p class="flex-auto">{{ responseError }}</p>
                            <button type="button" class="p-1">
                                <X />
                            </button>
                        </div>
                        <div class="!mt-8">

                            <Button type="submit" class="w-full" :loading>
                                <span>Login</span>
                            </Button>
                        </div>
                        <div class="space-y-2">
                            <p class="text-gray-600 text-center">
                                Dont have an account?
                                <router-link class="text-primary font-medium" to="/register">Register</router-link>
                            </p>
                        </div>
                    </div>
                </Form>
            </div>
        </base-container>
    </div>
</template>
<script lang="ts" setup>
import FormInput from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import FormLabel from '@/components/ui/label/Label.vue'
import { AuthLoading, useAuthStore } from "@/stores/auth"
import { AlertCircle, X } from 'lucide-vue-next'
import { Form, useForm } from "vee-validate"
import { computed, onMounted, ref } from "vue"
import { useRouter } from 'vue-router'
import * as yup from "yup"

const auth = useAuthStore()
const loading = computed(() => auth.isLoading(AuthLoading.LOGIN))
const { errors, defineField, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        email: yup.string().email().required("Email is required"),
        password: yup.string().min(6).required("Password is required"),
    }),
})

const [email] = defineField("email")
const [password] = defineField("password")
const responseError = ref('')

const router = useRouter()

const login = handleSubmit(async (values) => {
    responseError.value = ''
    const { email, password } = values
    const response = await auth.login({ email, password })

    if (response.error) {
        responseError.value = response.error
        return
    }

    if (response.success) {
        router.push('/')
    }
})


onMounted(() => {
    resetForm({
        values: {
            email: 'dave@test3.com',
            password: "secret"
        }
    })
})

</script>