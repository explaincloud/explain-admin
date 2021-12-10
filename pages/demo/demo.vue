<template>
  <amis @loaded="amisLoaded"></amis>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    onLoad() {

    },
    methods: {
      amisLoaded(e) {
        let schema = {
          type: 'page',
          title: '表单页面',
          body: {
            type: 'form',
            mode: 'horizontal',
            api: '/saveForm',
            body: [{
                label: 'Name',
                type: 'input-text',
                name: 'name'
              },
              {
                label: 'Email',
                type: 'input-email',
                name: 'email'
              }
            ]
          }
        }
        e.embed(schema)
      }
    }
  }
</script>

<style>

</style>
