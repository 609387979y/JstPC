<template>
    <div class="batchAdd">
        <el-dialog v-model="state.dialogVisible" title="表格导入/下载" width="600px" :before-close="handleClose">
            <input type="file" @change="changeFiles" :ref="(e: any) => { state.filesRef = e }" hidden />
            <div class="btn-container" @click="openInput" :ref="(e: any) => { state.boxRef = e }">

                <img src="@/assets/boxTrack/excel.svg" alt="" />
                <div>将文件拖至此处或<span style="color:#5AACFF">点击上传</span></div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    使用货物跟踪模板，支持批量添加&nbsp;&nbsp;&nbsp;
                    <el-button @click="dowloadModules" :icon="Download">下载模板</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, nextTick } from "vue"
import { ElMessage } from "element-plus"
import { Download } from "@element-plus/icons"
import request from "@/public/request"
export default defineComponent({
    setup(props, context) {
        let state = reactive({
            dialogVisible: false,
            filesRef: {} as HTMLInputElement,
            boxRef: {} as HTMLDivElement
        })
        /* 关闭批量对话框 */
        function handleClose() {
            state.dialogVisible = false
        }
        /* 开启批量对话框（由父组件调用） */
        function handleOpen() {
            state.dialogVisible = true;
            /* 打开对话框的时候，添加拖拽功能 */
            handleDragEvent();
        }
        /* 捕捉input变化，传入文件后执行 */
        async function changeFiles(e: any) {
            /* 开始上传 */
            await upLoad(e.target.files);

            /* 上传完后清空input，否则不能重复上传 */
            state.filesRef.value = ''

        }
        /* 打开文件夹 */
        function openInput() {
            state.filesRef.click();
        }
        /* 下载模板 */
        async function dowloadModules() {
            await download('/api/CT_TrackOcean/GetFile');

        }
        function download(url: any, data = {}) {
            return new Promise((resolve, reject) => {
                request.axios
                    .get(url, {
                        params: data,
                        responseType: 'blob'
                    })
                    .then(res => {
                        if (!res) {
                            ElMessage.error('下载模板文件失败')
                            return false
                        }
                        const blob = new Blob([res.data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                        })

                        const downloadElement = document.createElement('a')
                        const href = window.URL.createObjectURL(blob);
                        /* let contentDisposition = res.headers['content-disposition'] //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
                        let patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
                        let result = patt.exec(contentDisposition)
                        let filename = decodeURI(result[1]) */
                        downloadElement.style.display = 'none'
                        downloadElement.href = href
                        downloadElement.download = '及时通箱货跟踪模板'//下载后文件名
                        document.body.appendChild(downloadElement)
                        downloadElement.click() //点击下载
                        document.body.removeChild(downloadElement) //下载完成移除元素
                        window.URL.revokeObjectURL(href) //释放掉blob对象
                        resolve(href)
                    })
            })
        }

        /* 拖拽至指定区域上传 */
        async function handleDragEvent() {
            await nextTick();
            /* 可拖动的元素或选取的文本移出放置目标时执触发。 */
            state.boxRef.ondragleave = (e: any) => {
                e.preventDefault(); // 阻止离开时的浏览器默认行为
            };
            /* 可拖动元素或选取的文本放置在目标区域时触发。 */
            state.boxRef.ondrop = (e: any) => {
                e.preventDefault();
                upLoad(e.dataTransfer.files);

            };
            /* 拖动的元素或选择的文本进入到有效的放置目标时触发 */
            state.boxRef.ondragenter = (e: any) => {
                e.preventDefault();
                /* 样式高亮 */
                state.boxRef.classList.add('newActive')

            };
            /* 可拖动元素或选取的文本正在拖动到放置目标时触发。 */
            state.boxRef.ondragover = (e: any) => {
                e.preventDefault();

            };
        }
        /* 上传功能 */
        async function upLoad(file: any) {
            if (file.length == 0) return;

            /* 校验文件数量 */
            if (file.length != 1) return ElMessage.error('每次只能上传一个文件');
            let type = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

            /* 校验文件类型 */
            if (!type.includes(file[0].type)) return ElMessage.error('只能上传excel文件');

            /* 样式恢复 */
            state.boxRef.classList.add('oldActive');

            /* 上传文件 */
            let formData = new FormData();
            formData.append(file[0].name, file[0]);
            const result = await request.post('/api/CT_TrackOcean/Upload', formData);

            /* 消息提示 */
            if (!result.Status) return ElMessage.error(result.Message);
            if (result.Data.length == 0) return ElMessage.warning('请至少填写一条数据');
            if (result.Data.length > 101) return ElMessage.warning('只支持最多一次性可上传100条数据');
            /* 将船公司的小写转化为大写 */
            console.log(result.Data);

            let CarrierCode = true;
            result.Data.forEach((t: any) => {
                t.CarrierCode = t.CarrierCode ? t.CarrierCode.toUpperCase() : null;
                t.polName = '宁波';
                t.polNameEn = 'NINGBO'
                if (!t.CarrierCode) {
                    CarrierCode = false;
                }
            })
            /* 校验表格的填写是否正确 */
            if (!CarrierCode) return ElMessage.warning('数据填写不完整！');
            result.Data = qc(result.Data, 'BillNo', 'CarrierCode', 'containerNo')
            /* 关闭对话框 */
            handleClose();

            /* 把批量数据传至父组件 */
            context.emit('submit', result.Data)
        }
        function qc(tempArr: any, keys1: string, keys2: string, keys3: string) {
            let arr = JSON.parse(JSON.stringify(tempArr));
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    if (arr[i][keys1] == arr[j][keys1] && arr[i][keys2] == arr[j][keys2] && arr[i][keys3] == arr[j][keys3]) {
                        arr.splice(j, 1);
                        j--;
                    };
                };
            };
            return arr;

        }
        return {
            state,
            handleClose,
            handleOpen,
            changeFiles,
            openInput,
            dowloadModules,
            Download
        }
    },
})
</script>

<style lang="scss">
.batchAdd .el-dialog__header {
    padding: 24px 32px 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.batchAdd .el-dialog__body {
    padding: 0 32px 12px 32px;
}

.batchAdd .el-dialog__headerbtn {
    position: relative;
    top: 0;
    right: 0;
    height: 16px;
}

.batchAdd .el-dialog__header .el-dialog__title {
    font-size: 18px;
    color: #3C4144;
    font-weight: 500;
}

.batchAdd .el-dialog__footer {
    padding: 0 32px 20px 32px;
    text-align: right;
    font-size: 12px;
    color: #3C4144;
}
</style>
<style lang="scss">
.btn-container {
    width: 100%;
    height: 259px;
    border: 1px dashed #E4E7ED;
    text-align: center;
    font-size: 14px;
    color: #3C4144;
    font-weight: 500;
    cursor: pointer;
}

.btn-container img {
    margin-top: 90px;
    width: 48px;
    height: 48px;
}

.btn-container div {
    margin-top: 14px;
}

.btn-container:hover {
    border: 1px dashed #3496FB;
}

.newActive {
    border: 1px dashed #3496FB;
}

.oldActive {
    border: 1px dashed #E4E7ED;
}
</style>