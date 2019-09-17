<template>
  <el-table
    border
    :data="list.filter(data => !search || data.orderid.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%"
    min-height="700"
    show-header="false"
    :row-class-name="tableRowClassName"
  >
    <el-table-column type="selection" width="55" align="center"></el-table-column>
    <el-table-column prop="orderid" label="订单编号" width="230"></el-table-column>
    <el-table-column prop="type" label="订单类型" width="100"></el-table-column>
    <el-table-column prop="orderprice" label="订单金额" width="100"></el-table-column>
    <el-table-column prop="ordercreatedate" label="订单创建时间" width="170"></el-table-column>
    <el-table-column label="订单状态" width="80">
      <template slot-scope="scope">
        <span v-if="scope.row.status == 0" style="color:red">未支付</span>
        <span v-if="scope.row.status == 1" style="color:green">已支付</span>
        <span v-if="scope.row.status == 2" style="color:orange">未发货</span>
        <span v-if="scope.row.status == 3" style="color:green">已完成</span>
      </template>
    </el-table-column>
    <el-table-column prop="ordersenddate" label="订单提交时间" width="170"></el-table-column>
    <el-table-column prop="other" label="订单备注" min-width="250"></el-table-column>
    <el-table-column fixed="right" label="操作" width="260" align="center">
      <template slot="header">
        <el-input v-model="search" size="mini" placeholder="输入订单号" />
      </template>
      <template slot-scope="scope">
        <el-button @click.native.prevent="deleteRow(scope.$index, list)" size="mini">详情</el-button>
        <el-button
          @click.native.prevent="deleteRow(scope.$index, list)"
          type="danger"
          size="mini"
        >移除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style>
.el-table .warning-row {
  background: #fae4e4;
}

.el-table .success-row {
  background: #FFFFFF;
}
</style>

<script>
import { http } from "../../api/index";
export default {
  name: "order",
  data() {
    return {
      list: [],
      search: ""
    };
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    tableRowClassName({row, rowIndex}) {
        if (row.status >= 1) {
          return 'success-row';
        } else{
          return 'warning-row';
        }
        return '';
      }
  },

  mounted: function() {
    var _this = this;
    http("u/my/orders", { pageSize: 20, pageNum: 0 }).then(res => {
      console.log(res);
      if (res.success) {
        _this.list = res.data;
      }
    });
  }
};
</script>