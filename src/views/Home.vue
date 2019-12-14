<template>
	<el-container style="width: 100%; height: 100%;">
		<el-header>
			<div class="cs-title">
				<span>{{reportData.length > 0 ? reportData[0]['pipeName'] : '请先上传Excel'}}</span>
				<el-button size="medium" type="primary" plain @click="goToDetail">管理数据</el-button>
				<el-button size="medium" type="primary" plain @click="onShare">分享</el-button>
			</div>
		</el-header>
		<el-container>
			<el-aside style="width:30%;">
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
	async created() {
		await this.reloadAllData()
		this.renderPoint()
		this.renderLine()
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
	mounted() {
		this.amapView()
	},
	data() {
		return {
			map: {},
			photos: [],
			isPoint: true,
			pointForm: {},
			lineForm: {},
			pipelineColor: {
				"高压A": "#E600A9",
				"高压B": "#000000",
				"次高压A": "#FF0000",
				"次高压B": "#FF0000",
				"中压A": "#0000FF",
				"中压B": "#0000FF",
				"低压": "#266400"
			},
			checkpointIcon: {
				"阀门":"/static/icons/阀门.PNG",
				"绝缘接头":"/static/icons/绝缘接头.PNG",
				"测试桩":"/static/icons/测试桩.PNG",
				"阳极":"/static/icons/阳极.PNG",
				"破损点":"/static/icons/破损点.PNG",
				"泄漏点":"/static/icons/泄漏点.PNG",
				"异常点":"/static/icons/异常点.PNG",
				"转换接头":"/static/icons/转换接头.PNG",
				"占压":"/static/icons/占压.PNG",
				"生产作业":"/static/icons/生产作业.PNG",
				"应急":"/static/icons/应急.PNG",
				"测点":"/static/icons/测点.PNG",
				"其他":"/static/icons/其他.PNG",
				"凝水器":"/static/icons/凝水器.PNG",
				"调压箱":"/static/icons/调压箱.PNG",
				"调压站":"/static/icons/调压站.PNG",
				"开挖点":"/static/icons/开挖点.PNG",
				"接线点":"/static/icons/接线点.PNG",
				"1级":"/static/icons/1级.PNG",
				"2级":"/static/icons/2级.PNG",
				"3级":"/static/icons/3级.PNG",
				"4级":"/static/icons/4级.PNG",
				"保护":"/static/icons/保护.PNG",
				"欠保护":"/static/icons/欠保护.PNG"
			}
		};
	},
	methods: {
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
			
			_.each(that.checkpointData, function(point, index){
				let icon = new AMap.Icon({
					// 图标尺寸
					size: new AMap.Size(25, 25),
					// 图标的取图地址
					image: '/static/icons/' + point.type + '.PNG',
					// 图标所用图片大小
					imageSize: new AMap.Size(25, 25),
				})

				if(_.findIndex(that.multipleSelectedPoint, point) > -1 ){
					icon = new AMap.Icon({
						// 图标尺寸
						size: new AMap.Size(25, 25),
						// 图标的取图地址
						image: '/static/icons/' + point.type + '.PNG',
						// 图标所用图片大小
						imageSize: new AMap.Size(25, 25),
					})
				}
				let marker = new AMap.Marker({
					position: new AMap.LngLat(point.lon, point.lat),
					icon: icon,
					// offset: new AMap.Pixel(-13, -30),
					// content: point.checkPointName,
					title: point.checkPointName,
					bubble: true,
					topWhenClick: true,
					extData: point
				})
				marker.on('click', function(e){
					let p = e.target
					that.pointForm = p.getExtData()
					let photoNames = that.pointForm.photo ? that.pointForm.photo.split("；") : []
					let baseUrl = "http://localhost:8080/image/"
					that.photos = []
					_.each(photoNames, function(name){
						let photoObj = {
							name: name,
							src: baseUrl + that.uploadPhotoData.reportNum + "/" + name
						}
						that.photos.push(photoObj)
					})
					p.setIcon(new AMap.Icon({
						// 图标尺寸
						size: new AMap.Size(25, 25),
						// 图标的取图地址
						image: '/static/icons/' + that.pointForm.type + '.PNG',
						// 图标所用图片大小
						imageSize: new AMap.Size(25, 25),
					}))
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
				let strokeColor = that.pipelineColor[pipe.pressLevel]
				if(_.findIndex(that.multipleSelectedLine, pipe) > -1 ){
					strokeColor = that.pipelineColor[pipe.pressLevel]
				}
				let pipeline = new AMap.Polyline({
					path: pipe.pipePaths,
					cursor: 'pointer',
					strokeColor: strokeColor,
					isOutline: true,
					borderWeight: 4,
					outlineColor: '#ffeeff',
					strokeOpacity: 1,
					strokeWeight: 8,
					// 折线样式还支持 'dashed'
					strokeStyle: "solid",
					// strokeStyle是dashed时有效
					strokeDasharray: [8, 5],
					lineJoin: 'round',
					lineCap: 'round',
					zIndex: 8,
					extData: pipe
				})
				pipeline.on('click', function(e){
					let p = e.target
					that.lineForm = p.getExtData()
					p.setOptions({strokeColor: that.pipelineColor[that.lineForm.pressLevel]})
					that.isPoint = false
				})
				lines.push(pipeline)
			})
			let overlayGroups = new AMap.OverlayGroup(lines)
			this.map.add(overlayGroups)	 
		},
		amapView() {
			this.map = new AMap.Map('map-box', {
				resizeEnable: true,
				zoom: 11,
				center: ['116.537812', '40.02218045'],
				viewMode: '3D'
			})
			// this.map.plugin(['AMap.ToolBar', 'AMap.MapType'], function(){
			// 	this.map.addControl(new AMap.ToolBar())
			// 	this.map.addControl(new AMap.MapType({
			// 		showTraffic: false,
			// 		showRoad: false
			// 	}))
			// })

			this.map.setFitView()
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
		// height: 80px;
		span {
			display: inline-block;
			width: 60%;
			font-size: 28px;
			font-weight: bold;
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
