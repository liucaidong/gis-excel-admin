<template>
  <div style="width: 100%; height: 100%;">
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
              ref="checkpointTable"
              max-height="600"
              :data="checkpointData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="checkpointSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="checkPointNum"
                label="检测点编号"                
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="checkPointName"
                label="检测点名称"                
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="photo"
                label="照片"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注"                
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="lon"
                label="经度L"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="lat"
                label="纬度B"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="检测报告" name="second">
            <el-table
              max-height="600"
              :data="reportData"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                prop="reportNum"
                label="报告编号"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="pipeName"
                label="管道名称"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="pipeNum"
                label="管线编号"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="管线信息" name="third">
            <el-table
              ref="pipelineTable"
              max-height="600"
              :data="pipelineData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="pipelineSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="pipeNum"
                label="管线编号"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="projectName"
                label="测量工程名称"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="medium"
                label="运行介质"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="pressLevel"
                label="压力级制"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="material"
                label="材质"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="outerDiameter"
                label="外径(mm)"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="length"
                label="长度(m)"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="管段信息" name="fourth">
            <el-table
              max-height="600"
              :data="segmentData"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                prop="segmentNum"
                label="管段编号"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="startL"
                label="起点经度L"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="startB"
                label="起点纬度B"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="endL"
                label终点经度L姓名"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="endB"
                label终点纬度B姓名"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="pipeNum"
                label="管线编号"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="length"
                label="平面长度(m)"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog title="上传数据表" :visible.sync="dialogTableVisible">
      <el-upload
        drag
        name="file"
        action="http://localhost:8080/upload/"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">一次只能上传一个excel文件</div>
      </el-upload>
    </el-dialog>

    <el-dialog title="上传照片" :visible.sync="dialogPhotoVisible">
      <el-upload
        drag
        action="http://localhost:8080/fileUpload/"
        multiple
        :data="uploadPhotoData"
        name="files"
        :before-upload="beforePhotoUpload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将照片文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  name: 'Detail',
  data: function(){
    return {
      dialogTableVisible: false,
      dialogPhotoVisible: false,
      activeName: 'first',
      fileList: []
    }
  },
  created() {
    
  },
  mounted() {
    // this.$refs.checkpointTable.clearSelection()
    // this.$refs.pipelineTable.clearSelection()
    // if (this.multipleSelectedPoint.length > 0) {
    //   this.multipleSelectedPoint.forEach(row => {
    //     this.$refs.checkpointTable.toggleRowSelection(row, true)
    //   })
    // }
    // if (this.multipleSelectedLine.length > 0) {
    //   this.multipleSelectedLine.forEach(row => {
    //     this.$refs.pipelineTable.toggleRowSelection(row, true)
    //   })
    // }
  },
	computed: {
		...mapState([
			'checkpointData',
			'reportData',
			'pipelineData',
			'segmentData',
			'multipleSelectedPoint',
			'multipleSelectedLine',
      'uploadPhotoData'
		])
	},
  methods: {
    ...mapActions([
			'getmultipleSelectedPoint',
			'getMultipleSelectedLine'
		]),
    beforePhotoUpload(file) {
      if (this.uploadPhotoData.reportNum == "") {
        this.$message.error('请先上传Excel文件!');
        return false;
      }else {
        return true;
      }
    },
    goToHome(){
      this.$router.push({ path: '/' })
    },
    checkpointSelectionChange(val) {
      this.getmultipleSelectedPoint(val)
    },
    pipelineSelectionChange(val) {
      this.getMultipleSelectedLine(val)
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    beforeUpload(file){
      // console.log(file);
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  },
}
/* 
:on-preview="handlePreview"
:on-remove="handleRemove"
:before-remove="beforeRemove"
multiple
:limit="2"
:before-upload="beforeUpload"
:on-exceed="handleExceed"
:file-list="fileList"
 */
</script>