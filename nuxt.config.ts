// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, user-scalable=no viewport-fit=cover' }
      ]
    }
  },
  modules: ["@nuxtjs/tailwindcss"],
  postcss: {
    plugins: {
      tailwindcss: {}
    }
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },
  runtimeConfig: {
    minimumLoading: 333
  }
})