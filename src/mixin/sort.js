/**
 * 全局混入排序方法
 */
import axios from "@/api/axios";

export const sortmixin = {
    data() {
        return {
            sortnumber: 0,
            sortname: '',
            AxiosSortData: null,
            SortUrl: null,
            AxiosParams: {},
            SortOldName: null,
        }
    },
    methods: {
        SortReady(name) {
            this.sortnumber++;
            if (this.SortOldName !== name) {
                this.sortnumber = 1;
            } else if (this.SortOldName == name && this.sortnumber > 2) {
                this.sortnumber = 0;
            }
            this.SortOldName = name;
            if (this.sortnumber > 2) {
                this.sortnumber = 1;
            }
            this.SortNumberUpdate()
        },
        SortNumberUpdate() {
            if (this.sortnumber == 1) {
                this.$set(this.AxiosParams, 'orderParam', this.SortOldName);
                this.$set(this.AxiosParams, 'orderBy', 'asc')
            } else if (this.sortnumber == 2) {
                this.$set(this.AxiosParams, 'orderParam', this.SortOldName)
                this.$set(this.AxiosParams, 'orderBy', 'desc')
            } else {
                this.$delete(this.AxiosParams, 'orderBy');
                this.$delete(this.AxiosParams, 'orderParam')
            }
        },
        AxiosSort(name) {
            return new Promise((resolve, reject) => {
                if (name !== this.sortname) {
                    this.sortnumber = 1;
                }
                if (this.sortnumber > 2) {
                    this.sortnumber = 0
                }
                axios.post(this.SortUrl, this.AxiosParams).then((res) => {
                    resolve(res)
                }).catch((error) => {
                    console.log(error.response.data.message)
                })
                this.sortname = name;
            })
        }
    }
}