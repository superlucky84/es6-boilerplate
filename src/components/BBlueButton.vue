<template>
  <button
    v-bind="$attrs"
    type="button"
    class="btn-blue"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BBlueButton'
};
</script>
