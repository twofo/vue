import axios from "@/api/axios";
/**
 * 2021-04-20
 * 导出excel表格方法
 * 传入接口+参数+文件名
 */

export const importexcel = function (url, data , text) {
    // let requestConfig = {
    //     // headers: {
    //     //     "Content-Type": "application/json;application/octet-stream"
    //     // }
    // }
    axios.post(url, data, {
        responseType: "blob",
    }).then((res) => {
        const content = res.data;
        const blob = new Blob([content]);
        const fileName = text + '.xlsx';
        if ("download" in document.createElement("a")) {
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink)
        } else {
            navigator.msSaveBlob(blob, fileName)
        }
    })
}

export default {
    importexcel
}