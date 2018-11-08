<template functional>
  <button
    v-bind="data.attrs"
    type="button"
    class="btn"
    v-on="listeners"
  >
    <slot />
  </button>
</template>
