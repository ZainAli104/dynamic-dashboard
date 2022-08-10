<template>
  <v-card class="mx-auto pa-6" style="height: 26rem;" :loading="isLoading" max-width="700">
    <v-subheader class="py-0 mb-3 d-flex justify-space-between rounded-lg">
      <v-card-title style="color: green">Product Information</v-card-title>
    </v-subheader>
    <v-divider></v-divider>
    <v-col class="d-flex mt-2" v-for="product in products" :key="product.name">
      <v-card-text>{{ product.name }}</v-card-text>
    </v-col>
    <v-divider inset></v-divider>
    <v-col style="height: 26rem;" class="d-flex justify-space-between">
      <v-btn color="green" raised dark :disabled="page == 1" @click="prePage">Previous</v-btn>
      <v-btn color="green" raised dark :disabled="page > total" @click="nextPage">Next</v-btn>
    </v-col>
  </v-card>
</template>

<script>
import { db } from '../../firebase.js';
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
      products: []
    };
  },
  mounted() {
    this.$store.dispatch("changeTitle", "Products");
    this.loadData()
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
      this.isLoading = true
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
      this.isLoading = false
    },
    async nextPage() {
      this.isLoading = true
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
      this.isLoading = false
    },
    async prePage() {
      this.isLoading = true
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
      this.isLoading = false
    }
  }
};
</script>