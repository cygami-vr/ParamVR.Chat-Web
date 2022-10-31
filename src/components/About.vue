<script setup lang="ts">
import { reactive } from 'vue'
import fetchw from '@/fetchWrapper'

const state = reactive({discordInvite: '', creditsOpen: false})

fetchw('/discord', {
    method: 'GET'
}).then(async resp => {
    const text = await resp.text()
    // TODO why is it wrapped in quotes anyway? Maybe consider using resp.json()
    state.discordInvite = text.substring(1, text.length - 1)
})
</script>

<template>
    <h3>
        A professional looking interface is in the works,
        but we're still considering how public and polished we want to make this product.
        Please let us know your interest by joining the Discord
        <a target="_blank" :href="state.discordInvite">here</a>.
    </h3>
    <div class="footer">
        <p v-if="state.creditsOpen">
            <div>
                <a target="_blank" href="https://www.flaticon.com/free-icons/toggle-button" title="toggle button icons">Toggle button icons created by Icon Mela - Flaticon</a>
            </div>
            <a href="#" @click.prevent="state.creditsOpen = false">Hide this.</a>
        </p>
        <a v-else href="#" @click.prevent="state.creditsOpen = true">View site credits</a>
    </div>
</template>

<style scoped>
.footer {
    position: fixed;
    bottom: 0;
    background-color: rgba(64, 64, 64, 1);
    z-index: 10;
    padding-left: 10px;
    padding-right: 10px;
}
</style>
