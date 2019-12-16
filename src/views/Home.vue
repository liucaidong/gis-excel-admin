<template>
	<el-container style="width: 100%; height: 100%;">
		<el-header>
			<div class="cs-title">
				<span style="width: 25%; color: #888888; font-family:隶书; font-weight: bold; text-align: left;">燃气管道数据展示分析</span>
				<span style="width: 46%;">{{reportData.length > 0 ? reportData[0]['pipeName'] : '请先上传Excel'}}</span>
				<span style="width: 25%;">
					<el-button size="medium" type="primary" plain @click="goToDetail">管理数据</el-button>
					<el-button size="medium" type="primary" plain @click="onShare">分享</el-button>
				</span>
			</div>
		</el-header>
		<el-container>
			<el-aside style="width:25%;">
				<div>
					<div v-if="isPoint">
						<h3>检测点详情</h3>
						<el-form size="mini" label-position="right" label-width="160px" :model="pointForm">
							<el-form-item size="mini" label="检测点名称">
								<span>{{pointForm.checkPointName}}</span>
							</el-form-item>
							<el-form-item size="mini" label="检测点编号">
								<span>{{pointForm.checkPointNum}}</span>
							</el-form-item>
							<el-form-item size="mini" label="类型">
								<span>{{pointForm.type}}</span>
							</el-form-item>
							<el-form-item size="mini" label="经度L">
								<span>{{pointForm.lon}}</span>
							</el-form-item>
							<el-form-item size="mini" label="纬度B">
								<span>{{pointForm.lat}}</span>
							</el-form-item>
							<el-form-item size="mini" label="备注">
								<span>{{pointForm.remark}}</span>
							</el-form-item>
							<el-form-item size="mini" label="照片">
								<span>{{pointForm.photo}}</span>
							</el-form-item>
						</el-form>
						<el-carousel :interval="5000" arrow="always">
							<el-carousel-item v-for="item in photos" :key="item.name">
								<img :src="item.src" width="100%"></img>
							</el-carousel-item>
						</el-carousel>
					</div>
					<div v-else>
						<h3>管线详情</h3>
						<el-form size="mini" label-position="right" label-width="160px" :model="lineForm">
							<el-form-item size="mini" label="测量工程名称">
								<span>{{lineForm.projectName}}</span>
							</el-form-item>
							<el-form-item size="mini" label="管线编号">
								<span>{{lineForm.pipeNum}}</span>
							</el-form-item>
							<el-form-item size="mini" label="运行介质">
								<span>{{lineForm.medium}}</span>
							</el-form-item>
							<el-form-item size="mini" label="压力级制">
								<span>{{lineForm.pressLevel}}</span>
							</el-form-item>
							<el-form-item size="mini" label="材质">
								<span>{{lineForm.material}}</span>
							</el-form-item>
							<el-form-item size="mini" label="外径(mm)">
								<span>{{lineForm.outerDiameter}}</span>
							</el-form-item>
							<el-form-item size="mini" label="长度(m)">
								<span>{{lineForm.length}}</span>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</el-aside>
			<el-main style="width:70%;">
				<div id="map-box" style="width:100%; height: 100%;"></div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
// @ is an alias to /src

import AMap from 'AMap'
import _ from 'lodash'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
	name: "Home",
	components: {
	},
	created() {
	},
	computed: {
		...mapState([
      'isFirstLogin',
			'checkpointData',
			'reportData',
			'pipelineData',
			'segmentData',
			'multipleSelectedPoint',
			'multipleSelectedLine',
			'uploadPhotoData'
		])
	},
	async mounted() {
		this.amapView()
		await this.reloadAllData()
		this.renderPoint()
		this.renderLine()
	},
	data() {
		return {
			map: {},
			photos: [],
			isPoint: true,
			pointForm: {},
			lineForm: {}
		};
	},
	methods: {
    ...mapMutations([
      'setIsFirstLogin'
    ]),
		...mapActions([
			'reloadAllData',
			'getCheckpoint', 
			'getReport',
			'getPipeline',
			'getmultipleSelectedPoint',
			'getMultipleSelectedLine'
		]),
		renderPoint(){
			let that = this
			let points = []

			let selectedPoints = that.multipleSelectedPoint

			if(that.isFirstLogin){
				selectedPoints = that.checkpointData
      }
			
			_.each(selectedPoints, function(point, index){
				let icon = new AMap.Icon({
					size: new AMap.Size(25, 25),
					image: '/static/icons/' + point.type + '.png',
					imageSize: new AMap.Size(25, 25),
				})

				let marker = new AMap.Marker({
					// anchor: 'bottom-center',
					position: new AMap.LngLat(point.lon, point.lat),
					icon: icon,
					// offset: new AMap.Pixel(-13, -25),
					title: point.checkPointName,
					bubble: true,
					topWhenClick: true,
					extData: point
				})
				marker.on('click', function(e){
					let p = e.target
					that.pointForm = p.getExtData()
					let photoNames = that.pointForm.photo ? that.pointForm.photo.split("；") : []
					let baseUrl = "/image/"
					that.photos = []
					that.uploadPhotoData = that.uploadPhotoData || {}
					
					_.each(photoNames, function(name){
						let photoObj = {
							name: name,
							src: baseUrl + that.uploadPhotoData.reportNum + "/" + name
						}
						that.photos.push(photoObj)
					})

					that.isPoint = true
				})
				points.push(marker)
			})
			let overlayGroups = new AMap.OverlayGroup(points)
			this.map.add(overlayGroups)	 
		},
		renderLine(){
			let that = this
			let lines = []
			
			_.each(that.pipelineData, function(pipe, index){
				let strokeStyle = "dashed"
				if(_.findIndex(that.multipleSelectedLine, pipe) > -1 ){
					strokeStyle = "solid"
				}
				if(that.isFirstLogin){
					strokeStyle = "solid"
				}
				let pipeline = new AMap.Polyline({
					path: pipe.pipePaths,
					cursor: 'pointer',
					strokeColor: pipe.strokeColor,
					// isOutline: true,
					// borderWeight: 1,
					outlineColor: '#ffeeff',
					strokeOpacity: 1,
					strokeWeight: 4,
					// 折线样式还支持 'dashed'
					strokeStyle: strokeStyle,
					// strokeStyle是dashed时有效
					strokeDasharray: [6, 4],
					// lineJoin: 'round',
					// lineCap: 'round',
					zIndex: 8,
					extData: pipe
				})
				pipeline.on('click', function(e){
					let p = e.target
					that.lineForm = p.getExtData()
					that.isPoint = false
				})
				lines.push(pipeline)
			})
			let overlayGroups = new AMap.OverlayGroup(lines)
			this.map.add(overlayGroups)	 
		},
		amapView() {
			let that = this
			that.map = new AMap.Map('map-box', {
				resizeEnable: true,
				zoom: 11,
				center: ['116.537812', '40.02218045'],
				viewMode: '3D'
			})
			that.map.plugin(['AMap.ToolBar', 'AMap.MapType'], function(){
				that.map.addControl(new AMap.ToolBar())
				that.map.addControl(new AMap.MapType({
					showTraffic: false,
					showRoad: false
				}))
			})

			that.map.clearMap()

			that.map.setFitView()
		},
		goToDetail() {
			this.$router.push({ path: "detail" });
		},
		onShare() {
			this.$copyText(
				`${window.location.href}`
			).then(
				res => {
					this.$message({
						message: "当前地址已成功复制，可直接去分享",
						type: "success"
					});
				},
				err => {
					this.$message({
						message: "当前地址复制失败",
						type: "warning"
					});
				}
			);
		}
	}
};
</script>

<style scoped lang="scss">

	.cs-title {
		height: 60px;
		line-height: 60px;
		text-align: left;
		span {
			display: inline-block;
			font-size: 28px;
			text-align: center;
		}
	}
	.el-carousel__item h3 {
		color: #475669;
		font-size: 18px;
		opacity: 0.75;
		line-height: 300px;
		margin: 0;
	}

	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.el-carousel__item:nth-child(2n + 1) {
		background-color: #d3dce6;
	}

</style>
