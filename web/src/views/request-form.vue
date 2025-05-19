<template>
  <Container class="space-y-8">
    <Card>
      <CardHeader>
        <CardTitle>Make a request</CardTitle>
        <CardDescription>Give us the info on what you need and we'll hook you up.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form @submit="onSubmit()">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label>Name</Label>
              <div>
                <Input v-model="name" />
                <span class="text-sm text-red-500" v-if="errors.name">{{ errors.name }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <Label>Phone</Label>
              <div>
                <Input v-model="phone" />
                <span class="text-sm text-red-500" v-if="errors.phone">{{ errors.phone }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <Label>Describe the item you need</Label>
              <div>
                <Input v-model="item" />
                <span class="text-sm text-red-500" v-if="errors.item">{{ errors.item }}</span>
              </div>
            </div>
            <div>
              <Button type="submit" class="w-full">
                Save request
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  </Container>
</template>

<script setup lang="ts">
import Container from '@/components/base/container.vue';
import { useAuthStore } from '@/stores/auth';
import { computed, onMounted } from 'vue';
const auth = useAuthStore()
const userName = computed(() => auth.authenticated ? auth.user?.name.split(' ')[0] : '')
import Button from '@/components/ui/button/Button.vue';
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';

import { Form, useForm } from "vee-validate"
import * as yup from "yup"
import { userRequestService } from '@/services/useRequestService';
import Card from '@/components/ui/card/Card.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
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
const onSubmit = handleSubmit((values) => {
  requestService.createRequest({
    name: values.name,
    phone: values.phone,
    item: values.item,
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