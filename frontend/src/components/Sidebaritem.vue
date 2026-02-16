<template>
  <li class="sidebar-item">
    <a v-if="!submenu" :href="to" class="sidebar-link">
      <i class="material-icons">{{ icon }}</i>
      <span v-if="!$parent.collapsed">{{ text }}</span>
    </a>

    <div v-else>
      <a href="#" class="sidebar-link" @click.prevent="toggle">
        <i class="material-icons">{{ icon }}</i>
        <span v-if="!$parent.collapsed">{{ text }}</span>
        <i class="material-icons ms-auto">{{ open ? "expand_less" : "expand_more" }}</i>
      </a>
      <ul v-show="open" class="sidebar-dropdown">
        <li v-for="item in submenu" :key="item.text">
          <a :href="item.to" class="sidebar-link">
            <img v-if="item.img" :src="`@/assets/${item.img}`" width="20" class="me-2" />
            {{ item.text }}
          </a>
        </li>
      </ul>
    </div>
  </li>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  icon: String,
  text: String,
  to: String,
  submenu: Array,
});

const open = ref(false);

function toggle() {
  open.value = !open.value;
}
</script>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #000;
}
.sidebar-link:hover {
  background: #ddd;
}
.sidebar-dropdown {
  list-style: none;
  padding-left: 1.5rem;
}
</style>
