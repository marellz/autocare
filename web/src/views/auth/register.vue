<template>
    <div>
        <base-container>
            <h1 class="title">Register</h1>
            <div class="mt-10">
                <Form @submit="register()">
                    <div class="space-y-4">
                        <form-input label="Name" v-model="name" :error="errors.name" autocomplete="name"
                            required></form-input>
                        <form-input label="Email address" v-model="email" :error="errors.email" autocomplete="email"
                            type="email" required></form-input>
                        <form-input label="Password" v-model="password" autocomplete="password" :error="errors.password"
                            allow-password-toggle type="password" required></form-input>

                        <div class="!mt-8">
                            <base-button type="submit" class="w-full" :loading>
                                <span>Register</span>
                            </base-button>
                        </div>
                        <div class="space-y-2">
                            <p class="text-gray-600 text-center">
                                Already have an account?
                                <router-link class="text-primary font-medium" to="/login">Login</router-link>
                            </p>
                        </div>
                    </div>
                    {{ errors }}
                </Form>
            </div>
        </base-container>
    </div>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue'
import { AuthLoading, useAuthStore } from "@/stores/auth"
import { Form, useForm } from "vee-validate"
import { computed, onMounted } from "vue"
import { useRouter } from 'vue-router'
import * as yup from "yup"

const auth = useAuthStore()
const loading = computed(() => auth.isLoading(AuthLoading.REGISTER))
const { errors, defineField, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        name: yup.string().required("Name is required"),
        email: yup.string().email().required("Email is required"),
        password: yup.string().min(6).required("Password is required"),
    }),
})

const [name] = defineField("name")
const [email] = defineField("email")
const [password] = defineField("password")

const router = useRouter()

const register = handleSubmit(async (values) => {
    const { email, password, name } = values
    const response = await auth.register({ email, password, name })

    if (response.error) throw new Error(response.error)
    if (response.success) {
        router.push('/')
    }
})

onMounted(() => {
    resetForm({
        values: {
            email: 'dave@test3.com',
            name: "Dave Njoroge",
            password: "secret"
        }
    })
})

</script>