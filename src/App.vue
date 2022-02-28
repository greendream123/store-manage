<template>
  <router-view v-title :data-title="title" />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const title = t('webTitle')
</script>

<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
</style>
