<template>
<!-- 查询 -->
    <span>
        <el-input class="search-input" v-model="value" :placeholder="placeholder" suffix-icon="el-icon-search"></el-input> 
        <el-button @click="searchHandle">查询</el-button>
    </span>
</template>

<script>
export default {
    name: 'Search',
    props: {
        placeholder: {
            type: String,
            default: '请输入内容'
        }
    },
    data() {
        return {
            value: ''
        }
    },
    methods: {
        searchHandle() {
            this.$emit('searchHandle', this.value)
        }
    }
}
</script>