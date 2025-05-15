<script setup>

import Navbar from './pages/navbar.vue';
import authHandler from '@/composables/oauthHandler'

const router = useRouter()
router.beforeEach(async (to, from) => {
  await authHandler(to, from)
})

</script>

<template>


  <div class="flex-col flex h-screen">
    <Navbar />
    <NuxtPage class="h-full flex-1" />
  </div>
</template>
