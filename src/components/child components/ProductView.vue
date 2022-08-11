<template>
  <div>
    <v-subheader class="py-0 mb-3 d-flex justify-space-between rounded-lg">
      <v-card-title style="color: green">Product Information</v-card-title>
    </v-subheader>
    <v-divider></v-divider>
    <data-table
      :headers="headers"
      :items="products"
      title="Nutritions"
      showSeachBar="true"
      showActoins="true"
    ></data-table>
    <v-divider inset></v-divider>
    <v-col class="d-flex justify-space-between">
      <v-btn color="green" raised dark :disabled="page == 1" @click="prePage"
        >Previous</v-btn
      >
      <v-btn
        color="green"
        raised
        dark
        :disabled="page > total"
        @click="nextPage"
        >Next</v-btn
      >
    </v-col>
  </div>
</template>

<script>
import DataTable from "../DataTable/DataTable2.vue";
import { db } from "../../firebase.js";
import {
  collection,
  getDocs,
  query,
  startAfter,
  orderBy,
  limit,
  endBefore,
  limitToLast,
} from "@firebase/firestore";

export default {
  data() {
    return {
      isLoading: false,
      total: "",
      limit: 3,
      paginas: "",
      page: 1,
      lastVisible: "",
      firstVisible: "",
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" },
        { text: "Actions", value: "action" },
      ],
      products: [],
    };
  },
  components: {
    DataTable,
  },
  mounted() {
    this.$store.dispatch("changeTitle", "Products");
    this.loadData();
  },
  methods: {
    async obtainTotalDocuments() {
      const totalDocs = query(collection(db, "products"));
      const documentSnapshots = await getDocs(totalDocs);
      const total = documentSnapshots.docs.length;
      this.total = total / 3;
      this.paginas = Math.ceil(this.total / this.limit);
    },
    async loadData() {
      this.isLoading = true;
      const first = query(
        collection(db, "products"),
        orderBy("name"),
        limit(this.limit)
      );
      await this.obtainTotalDocuments();

      const documentSnapshots = await getDocs(first);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1] || null;
      const firstVisible = documentSnapshots.docs[0] || null;
      this.firstVisible = firstVisible;
      this.lastVisible = lastVisible;

      const querySnapshot = await getDocs(first);
      querySnapshot.forEach((doc) => {
        let obra = doc.data();
        obra.id = doc.id;
        this.products.push(obra);
        console.log(obra);
      });
      this.isLoading = false;
    },
    async nextPage() {
      this.isLoading = true;
      const next = query(
        collection(db, "products"),
        orderBy("name"),
        limit(this.limit),
        startAfter(this.lastVisible)
      );
      const documentSnapshots = await getDocs(next);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1] || null;
      this.lastVisible = lastVisible;
      const firstVisible = documentSnapshots.docs[0] || null;
      this.firstVisible = firstVisible;
      this.page = this.page + 1;

      this.products = [];
      const querySnapshot = await getDocs(next);
      querySnapshot.forEach((doc) => {
        let obra = doc.data();
        obra.id = doc.id;
        this.products.push(obra);
      });
      this.isLoading = false;
    },
    async prePage() {
      this.isLoading = true;
      const back = query(
        collection(db, "products"),
        orderBy("name"),
        limitToLast(this.limit),
        endBefore(this.firstVisible)
      );

      const documentSnapshots = await getDocs(back);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1] || null;
      this.lastVisible = lastVisible;
      const firstVisible = documentSnapshots.docs[0] || null;
      this.firstVisible = firstVisible;
      this.page = this.page - 1;

      this.products = [];
      const querySnapshot = await getDocs(back);
      querySnapshot.forEach((doc) => {
        let obra = doc.data();
        obra.id = doc.id;
        this.products.push(obra);
      });
      this.isLoading = false;
    },
  },
};
</script>