<template>
 <div class="content">
     <div  v-for="(item, index) in content"
        :key="index" class="box" style="backgroundColor:#f1f9ff">
        <div
        class="aside-item"
        @click="item_check(item, index)"
       
      >
        <div
          class="aside-item-check"
          :class="aside_item_num == index ? 'active' : ''"
        ></div>
        <span>{{item.name}}</span>
        <i class="el-icon-arrow-down" v-if="aside_item_num == index?aside_item_down:false"></i>
         <i class="el-icon-arrow-right" v-if="aside_item_num == index ?aside_item_right:true"></i>
      </div>
        <contentitem v-if="index == aside_item_num?true:false" :content="item.children"></contentitem>
     </div>
      
    
 </div>
</template>

<script>
export default {
    name:"contentitem",
    data () {
        return {
             aside_item_num: -1,
              aside_item_right:true,
        aside_item_down:false,
        }
    },
  props: ['content'],
  methods: {
       item_check(item, index) {
      if (this.aside_item_num == index) {
        this.aside_item_num = -1;
        this.aside_item_right = !this.aside_item_right;
       this.aside_item_down  = !this.aside_item_down;
      } else {
        this.aside_item_num = index;
        this.aside_item_right = false;
       this.aside_item_down = true;
      }
      if ((this.aside_item_check = true)) {
        this.aside_title_check = false;
      }
    },

  },
mounted () {
}
}
</script>

<style lang="scss" scoped>
.box {
  padding-left: 20px;
 
.aside-item {
    height: 50px;
    padding-left: 20px;
    line-height: 50px;
    background-color: #f1f9ff;
    border-bottom: 3px solid #f7f7f7;
    // padding-left: 40px;
    cursor: pointer;
         position: relative;
    .aside-item-check {
      display: inline-block;
      width: 15px;
      height: 15px;
      border-radius: 4px;
      border: 2px solid #c3c5c7;
 
    }
    span {
      display: inline-block;
      margin-left: 10px;
      font-weight: 700;
    }
    i {
      display: inline-block;
      color: #6cbcff;
      font-size: 25px;
      position: absolute;
      right: 20px;
      top: 10px;
    }
    .aside-item  {
 padding-left: 50px;
    } 
  }
  .aside-item:hover {
    border-left: 3px solid #2c9dff;
    background-color: #e9f5ff;
  }
}
  
  .active {
  background-color: none;
  background-color: #319fff !important;
}
</style>