<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="data-table__header">{{ title }}</span>
        <v-spacer></v-spacer>

        <div style="margin-right: 20px; margin-bottu">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            v-if="showSeachBar === 'true'"
          ></v-text-field>
        </div>

        <slot name="title_action"></slot>
        <template v-if="showActoins === 'true'">
          <v-btn color="primary mt-4" dark class="mb-2" elevation="6" @click="addItem">
            <v-icon class="v-btn__pre-icon" small>mdi-plus</v-icon>&nbsp; New
            Item
          </v-btn>
          <v-btn
            id="refresh"
            class="refresh"
            icon
            style="margin-top: 5px; margin-left: 10px"
            @click="refreshData"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-card-title>

      <v-data-table
        :search="search"
        :headers="headers"
        :items="items"
        :items-per-page="5"
        class="elevation-1"
        hide-default-footer
      >
        <template v-slot:item.action="{ item }">
          <slot name="add_action"></slot>

          <v-icon small class="mr-2" color="green" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="red" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      require: false,
    },
    items: {
      type: Array,
      require: false,
    },
    allowFilters: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      require: false,
    },
    showSeachBar: {
      type: String,
      default: "false",
    },
    showActoins: {
      type: String,
      default: "false",
    },
  },
  emits: ["editItem", "deleteItem", "addItem", 'refreshData'],
  data() {
    return {
      search: "",
    };
  },
  mounted() {
    this.$emit("refreshData");
  },
  methods: {
    editItem(item) {
      this.$emit("editItem", item);
    },
    deleteItem(item) {
      this.$emit("deleteItem", item);
    },
    refreshData() {
      this.$emit('refreshData')
    },
    addItem() {
      this.$emit('addItem')
    }
  },
};
</script>