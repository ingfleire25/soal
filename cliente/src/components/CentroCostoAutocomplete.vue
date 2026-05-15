<template>
  <div class="position-relative">
    <input
      type="text"
      class="form-control form-control-sm"
      :placeholder="placeholder"
      :required="required"
      autocomplete="off"
      :value="search"
      @input="onInput($event.target.value)"
      @focus="openDropdown = true"
      @blur="onBlur"
    />

    <div
      v-if="openDropdown"
      class="dropdown-menu show w-100"
      style="max-height: 240px; overflow-y: auto; z-index: 2000;"
    >
      <div v-if="loading" class="dropdown-item text-muted">Cargando...</div>
      <div v-else-if="filteredResults.length === 0" class="dropdown-item text-muted">
        Ingresa al menos 2 caracteres para buscar.
      </div>
      <button
        v-for="item in filteredResults"
        :key="item.GLACCOUNT"
        type="button"
        class="dropdown-item"
        @mousedown.prevent="selectItem(item)"
      >
        <strong>{{ item.GLACCOUNT }}</strong>
        <br />
        <small>{{ item.NAME }}</small>
      </button>
    </div>
  </div>
</template>

<script>
import { getChartOfAccounts } from '@/services/getChartOfAccounts';

export default {
  name: 'CentroCostoAutocomplete',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'CC/OI'
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: this.modelValue || '',
      items: [],
      loading: false,
      openDropdown: false,
      blurTimeout: null
    };
  },
  watch: {
    modelValue(value) {
      this.search = value || '';
    }
  },
  computed: {
    filteredResults() {
      const term = (this.search || '').trim().toLowerCase();
      if (term.length < 2) {
        return [];
      }

      return this.items
        .filter(item =>
          item.GLACCOUNT.toLowerCase().includes(term) ||
          item.NAME.toLowerCase().includes(term)
        )
        .slice(0, 20);
    }
  },
  methods: {
    async loadItems() {
      if (this.items.length || this.loading) {
        return;
      }
      this.loading = true;
      try {
        this.items = await getChartOfAccounts();
      } catch (error) {
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
    onInput(value) {
      this.search = value;
      this.$emit('update:modelValue', value);

      if (this.search.trim().length >= 2) {
        this.openDropdown = true;
        this.loadItems();
      } else {
        this.openDropdown = false;
      }
    },
    selectItem(item) {
      this.search = item.GLACCOUNT;
      this.$emit('update:modelValue', item.GLACCOUNT);
      this.openDropdown = false;
    },
    onBlur() {
      this.blurTimeout = setTimeout(() => {
        this.openDropdown = false;
      }, 150);
    }
  },
  beforeUnmount() {
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
  }
};
</script>
