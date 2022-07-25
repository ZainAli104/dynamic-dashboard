<template>
    <h2>Products</h2>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('changeTitle', 'Products');
  },
};
</script>