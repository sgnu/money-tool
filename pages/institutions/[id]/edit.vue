<script setup lang="ts">
const route = useRoute()
let isLoading = ref(false)
let formData = reactive({
    id: 0,
    name: '',
    url: '',
    icon: ''
} as Institution)

await useFetch(`/api/institutions/${route.params.id}`, {
    onResponse({ response }) {
        formData = response._data as Institution
    }
})

const submit = () => {
    $fetch('/api/institutions', {
        method: 'PUT',
        body: formData,
        onResponse() {
            navigateTo('/institutions')
        }
    })
}
</script>

<template>
    <div class="flex justify-center">
        <FormCard @submit.prevent="submit">
            <label class="input input-bordered flex items-center gap-2 w-[100%]">
                Name
                <input type="text" class="grow" v-model="formData.name" />
            </label>
            <label class="input input-bordered flex items-center gap-2 w-[100%]">
                URL
                <input type="text" class="grow" v-model="formData.url" />
            </label>
            <label class="input input-bordered flex items-center gap-2 w-[100%]">
                Favicon
                <input type="text" class="grow" v-model="formData.icon"/>
            </label>
            <input type="submit" class="btn btn-primary" value="Save">
        </FormCard>
        <div role="dialog" :class="isLoading ? 'modal modal-open' : 'modal'">
            <div class="modal-box flex justify-center w-36">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        </div>
    </div>
</template>