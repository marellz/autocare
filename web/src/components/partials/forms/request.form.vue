<template>
  <Form @submit="onSubmit()" ref="request-form">
    <Dialog>
      <DialogTrigger as-child>
        <Button type="button">
          Make request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New request</DialogTitle>
          <DialogDescription>Give us the info on what you need and we'll hook you up.</DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <form-input label="Name" v-model="name" :error="errors.name"></form-input>
          <form-input label="Phone" v-model="phone" :error="errors.phone"></form-input>
          <form-text label="Describe the item you need" v-model="item" :error="errors.item"></form-text>

        </div>
        <DialogFooter as-child>
          <Button class="w-full" type="submit">
            Save request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import FormInput from '@/components/custom/form/input.vue';
import FormText from '@/components/custom/form/text.vue';
import { computed, onMounted, useTemplateRef } from 'vue'
import Button from '@/components/ui/button/Button.vue';

import { useAuthStore } from '@/stores/auth';
import { Form, useForm } from "vee-validate"
import * as yup from "yup"
import { userRequestService } from '@/services/useRequestService';

const auth = useAuthStore()
const userName = computed(() => auth.authenticated ? auth.user?.name.split(' ')[0] : '')

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'


const { errors, defineField, handleSubmit, resetForm, setErrors } = useForm({
  validationSchema: yup.object({
    name: yup.string().required("Your name is required"),
    phone: yup.string().required("Phone number is required"),
    item: yup.string().required("Item is required"),
  }),
})

const [name] = defineField("name")
const [phone] = defineField("phone")
const [item] = defineField("item")

const requestService = userRequestService()

onMounted(() => {
  resetForm({
    values: {
      name: 'Dave N.',
      phone: '0808080',
      item: 'xxx for xxx car',
    }
  })
})
const form = useTemplateRef('request-form')
const onSubmit = handleSubmit((values) => {
  requestService.createRequest({
    name: values.name,
    phone: values.phone,
    item: values.item,
    channel: 'web',
  })
    .then(() => {
      resetForm()
      alert('Request created successfully')
    })
    .catch((error) => {
      console.log(error)
      // setErrors(error.response)
    })
})
</script>