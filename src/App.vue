<script setup>
import { Button, Column, DataTable, Dialog, Select, Tag } from 'primevue'
import { onMounted, ref } from 'vue'
import LoginItem from './components/LoginItem.vue'
import { downloadFile, editCell, getTable } from './api'
import KmgLogoIcon from './components/icons/KmgLogoIcon.vue'

const isAuthorized = ref(Boolean(localStorage.getItem('access_token')))
const tableRows = ref([])
const isPreviewVisible = ref(false)
const previewImageUrl = ref('')

const tableHeadings = [
  { key: 'user_name', label: 'Отправитель' },
  { key: 'iin', label: 'ИИН' },
  { key: 'work_place', label: 'Место работы' },
  { key: 'telephone_number', label: 'Телефон' },
  { key: 'appeal_text', label: 'Обращение' },
  { key: 'to_whom', label: 'Получатель' },
  { key: 'status', label: 'Статус' },
  { key: 'lang', label: 'Язык' },
  { key: 'file_name', label: 'Файл' },
]

const filters = ref({
  status: { value: null },
  lang: { value: null },
})
const statuses = ref(['Новая', 'В работе', 'Исполнено', 'Отклонено'])
const langs = ref(['kaz', 'ru', 'en'])

const handleTable = async () => {
  try {
    const { data } = await getTable()
    tableRows.value = data
  } catch (error) {
    alert(error)
  }
}

const handleCellEdit = async (row) => {
  try {
    const params = {
      id: `eq.${row.data.id}`,
    }
    await editCell(params, { status: row.newData.status })
    await handleTable()
  } catch (error) {
    alert(error)
  }
}

const handlePreview = async (filename) => {
  try {
    const { data } = await downloadFile(filename)
    if (data && data instanceof Blob) {
      const url = URL.createObjectURL(data)
      previewImageUrl.value = url
      isPreviewVisible.value = true
      setTimeout(() => URL.revokeObjectURL(url))
    }
  } catch (error) {
    alert(error)
  }
}

const handleFileDownload = async (filename) => {
  try {
    const { data } = await downloadFile(filename)
    if (data && data instanceof Blob) {
      const a = document.createElement('a')
      const url = URL.createObjectURL(data)
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
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
      <div class="logo-holder">
        <h2>KMG-Senim</h2>
        <KmgLogoIcon />
      </div>
      <Button @click="handleLogout">Выйти</Button>
    </header>
    <div class="table-container">
      <DataTable
        v-model:filters="filters"
        :value="tableRows"
        :table-style="{ maxHeight: '100%' }"
        scrollHeight="flex"
        filterDisplay="menu"
        editMode="cell"
        @cell-edit-complete="handleCellEdit"
      >
        <Column
          v-for="heading in tableHeadings"
          :key="heading.key"
          :field="heading.key"
          :header="heading.label"
          :showFilterMatchModes="false"
          :showApplyButton="false"
          :rowEditor="true"
        >
          <template #body="{ data }" v-if="heading.key === 'file_name'">
            <template v-if="data[heading.key]">
              <a @click="handlePreview(data[heading.key])" style="display: block">Просмотр</a>
              <a @click="handleFileDownload(data[heading.key])" style="display: block">Скачать</a>
            </template>
          </template>
          <template
            v-if="['status', 'lang'].includes(heading.key)"
            #filter="{ filterModel, filterCallback }"
          >
            <Select
              v-if="heading.key === 'status'"
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="statuses"
              placeholder="Выберите статус"
              style="min-width: 12rem"
            >
              <template #option="slotProps">
                <Tag :value="slotProps.option" />
              </template>
            </Select>
            <Select
              v-if="heading.key === 'lang'"
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="langs"
              placeholder="Выберите язык"
              style="min-width: 12rem"
            >
              <template #option="slotProps">
                <Tag :value="slotProps.option" />
              </template>
            </Select>
          </template>
          <template v-if="heading.key === 'status'" #editor="{ data, field }">
            <Select
              v-if="heading.key === 'status'"
              v-model="data[field]"
              :options="statuses"
              placeholder="Выберите статус"
              style="min-width: 8rem"
            >
              <template #option="slotProps">
                <Tag :value="slotProps.option" />
              </template>
            </Select>
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog v-model:visible="isPreviewVisible" style="width: 75vw" modal class="p-fluid">
      <img :src="previewImageUrl" alt="Preview" style="width: 100%; height: auto; display: block" />
    </Dialog>
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

.logo-holder {
  display: flex;
  align-items: center;
  column-gap: 30px;
}

.table-container {
  height: calc(100% - 56px);
}

.table-container > div,
.table-container :deep(.p-datatable-table-container) {
  height: 100%;
}

.table-container :deep(.p-datatable-table-container) a {
  cursor: pointer;
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
