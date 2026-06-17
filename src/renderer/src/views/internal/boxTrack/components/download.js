import request from "@/public/request";
function download(url, data = {}) {
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
                    type: 'image/png;charset=utf-8'
                })

                /* const downloadElement = document.createElement('a') */
                const href = window.URL.createObjectURL(blob)
                /* let contentDisposition = res.headers['content-disposition'] //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
                let patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
                let result = patt.exec(contentDisposition)
                let filename = decodeURI(result[1]) */
                /* downloadElement.style.display = 'none'
                downloadElement.href = href
                downloadElement.download = new Date().getTime()//下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() //点击下载
                document.body.removeChild(downloadElement) //下载完成移除元素
                window.URL.revokeObjectURL(href) //释放掉blob对象 */
                resolve(href)
            })
    })
}
export { download }
