<script setup lang="ts">
import { reactive } from 'vue'
import fetchw from '@/fetchWrapper'

const state = reactive({discordInvite: ''})

fetchw('/discord', {
    method: 'GET'
}).then(async resp => {
    const text = await resp.text()
    state.discordInvite = text
})
</script>

<template>
    <div id="about" class="modal fade" tabindex="-1" aria-labelledby="aboutLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="aboutLabel">About ParamVR.Chat</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" />
                </div>
                <div class="modal-body">
                    <a class="btn btn-primary" :href="state.discordInvite" target="_blank" role="button">Interested in ParamVR? Join the Discord community!</a>
                    <a class="btn btn-info mt-3" href="https://github.com/cygami-vr/" target="_blank" role="button">Check out the source code on GitHub</a>
                    <a class="btn btn-secondary mt-3" href="https://www.flaticon.com/free-icons/toggle-button" target="_blank" role="button">
                        Toggle button icons created by Icon Mela - Flaticon
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
</style>
