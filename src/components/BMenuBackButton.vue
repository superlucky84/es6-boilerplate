<template>
  <button
    v-bind="$attrs"
    type="button"
    class="btn-back"
    v-on="$listeners"
  >
    previous
  </button>
</template>

<script>
export default {
  name: 'BMenuBackButton'
};
</script>
