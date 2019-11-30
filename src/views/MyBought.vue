<template>
  <div>
    <h1>我买到的</h1>
  </div>
</template>

<script>
import api from "@/utils/api";

export default {
  created() {
    api.getMyBought().then(res => {
      console.log(res);
    });
  }
};
</script>

<style></style>
