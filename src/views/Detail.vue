<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-button size="medium" type="primary" plain @click="dialogTableVisible = true">上传数据表</el-button>
        <el-button size="medium" type="primary" plain @click="dialogPhotoVisible = true">上传照片</el-button>
        <el-button size="medium" type="primary" plain @click="goToHome">返回首页</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="检测点" name="first">
            <el-table
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="检测报告" name="second">
            <el-table
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                prop="name"
                label="姓名"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="管线信息" name="third">
            <el-table
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="管段信息" name="fourth">
            <el-table
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                prop="name"
                label="姓名"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
      <el-upload
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="2"
        :before-upload="beforeUpload"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能同时上传两个excel文件</div>
      </el-upload>
    </el-dialog>

    <el-dialog title="收货地址" :visible.sync="dialogPhotoVisible">
      <el-upload
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将照片文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: 'Detail',
  data: function(){
    return {
      dialogTableVisible: false,
      dialogPhotoVisible: false,
      activeName: 'first',
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },
  methods: {
    goToHome(){
      this.$router.push({ path: '/' })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    beforeUpload(file){
      console.log(file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  },
}
</script>