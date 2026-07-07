<template>
    <AppVxeTable :showPager="false" class="vex-table-primary freight-table" :tableData="tableData"
        :columnList="sonColumnList">
        <vxe-column title="" width="49">
        </vxe-column>
        <template #cz="{ row }" v-if="!nobtn">
            <div class="text-btn" @click="goChat">查看聊天</div>
        </template>
    </AppVxeTable>
</template>

<script setup>
import AppVxeTable from "@/components/AppVxeTable.vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
const router = useRouter()
const props = defineProps(
    {
        tableData: {
            type: Array,
            default: () => []
        },
        sonColumnList: {
            type: Array,
            default: () => []
        },
        BusinessDocumentsId: {
            type: String,
            default: ''
        },
        Type: {
            type: Array,
            default: '1'
        },
        nobtn: {
            type: Boolean,
            default: false
        }
    }
)

const emit = defineEmits(['goChat'])
const goChat = () => {
    const path = props.Type == 2 ? '/internal/ChatWin' + props.BusinessDocumentsId + '1' : '/internal/ChatWin' + props.BusinessDocumentsId
    router.push({ path: path, query: { BusinessDocumentsId: props.BusinessDocumentsId, Type: props.Type } })
}

onMounted(() => {
    console.log(props)
})

</script>

<style lang="scss" scoped>
:deep(.vxe-table) {
    border: 1px solid #FD953E;

    .vxe-header--column {
        background-color: #FFFCFA;
    }

    .vxe-body--column {
        background-color: #FFFCFA;
    }
}

:deep(.vxe-table--body-wrapper) {
    min-height: 0 !important;
}
</style>