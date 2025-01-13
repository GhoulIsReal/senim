<script setup>
import { Button, Column, DataTable } from 'primevue'
import { onMounted, ref } from 'vue'
import LoginItem from './components/LoginItem.vue'
import { getTable } from './api'

const isAuthorized = ref(Boolean(localStorage.getItem('access_token')))
const tableData = ref([])

const handleTable = async () => {
  try {
    const { data } = await getTable()
    tableData.value = data
  } catch (error) {
    alert(error)
  }
}

const handleLogout = () => {
  localStorage.removeItem('access_token')
  isAuthorized.value = false
}

onMounted(() => {
  if (isAuthorized.value) handleTable()
})
</script>

<template>
  <LoginItem v-if="!isAuthorized" />
  <div v-else class="main-content">
    <header>
      <h2>Senim</h2>
      <Button @click="handleLogout">Выйти</Button>
    </header>
    <div class="table-container">
      <DataTable :value="tableData" :table-style="{ height: '100%' }" scrollHeight="flex">
        <Column
          v-for="(columnValue, columnKey) of tableData[0]"
          :key="columnKey"
          :field="columnKey"
          :header="columnKey"
        ></Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  display: flex;
  width: 100%;
  max-height: 36px;
  justify-content: space-between;
}

.main-content {
  display: flex;
  flex-flow: column;
  row-gap: 20px;
  width: 100%;
  height: 100%;
}

.table-container {
  height: calc(100% - 56px);
}

.table-container > div,
.table-container :deep(.p-datatable-table-container) {
  height: 100%;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
