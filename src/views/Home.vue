<template>
	<div class="cs-home-box">
		<div id="map-box" style="width:100%; height: 100%;position:relative;"></div>
		<!-- float title -->
		<img class="cs-title" src="/static/images/banner.png" />
		<div class="cs-panel-btn">
			<el-button size="medium" type="primary" plain @click="goToDetail">管理数据</el-button>
			<el-button size="medium" type="primary" plain @click="onShare">分享</el-button>
		</div>
		<!-- float panel -->
		<div class="cs-panel" :style="csDetailPanel" >
			<div class="cs-toggle-btn" @click="onToggleDetailPanel">
				<i class="el-icon-arrow-left" v-if="csDetailPanel.right == '-500px'"></i>
				<i class="el-icon-arrow-right" v-if="csDetailPanel.right == '50px'"></i>
			</div>
			<div class="cs-toggle-btn-shade"></div>
			<div class="cs-panel-title">
				{{reportData.length > 0 ? reportData[0]['pipeName'] : '请先上传Excel'}}
			</div>
			<div v-if="isPoint">
				<h3 class="cs-info-h3">检测点详情</h3>
				<el-form size="mini" label-position="right" label-width="130px" :model="pointForm">
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
						<img :src="item.src" height="100%" />
					</el-carousel-item>
				</el-carousel>
			</div>
			<div v-else>
				<h3 class="cs-info-h3">管线详情</h3>
				<el-form size="mini" label-position="right" label-width="130px" :model="lineForm">
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
	</div>
</template>

<script>
// @ is an alias to /src

import AMap from "AMap";
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";

import backendUrl from '../config'

export default {
	name: "Home",
	components: {},
	created() {},
	computed: {
		...mapState([
			"isFirstLogin",
			"checkpointData",
			"reportData",
			"pipelineData",
			"segmentData",
			"orphanSegmentData",
			"multipleSelectedPoint",
			"multipleSelectedLine",
			"uploadPhotoData"
		])
	},
	async mounted() {
		this.amapView();
		await this.reloadAllData();
	},
	watch: {
		checkpointData: function(val){
			this.renderPoint();
		},
		pipelineData: function(val){
			this.renderLine();
		}
	},
	data() {
		return {
			csDetailPanel: {
				right: '-500px'
			},
			map: {},
			photos: [],
			isPoint: true,
			pointForm: {},
			lineForm: {}
		};
	},
	methods: {
		...mapMutations(["setIsFirstLogin"]),
		...mapActions([
			"reloadAllData",
		]),
		onToggleDetailPanel(){
			this.csDetailPanel.right === '-500px' ? this.csDetailPanel.right = '50px' : this.csDetailPanel.right = '-500px'
		},
		renderPoint() {
			let that = this;
			let points = [];

			let selectedPoints = that.multipleSelectedPoint;

			if (that.isFirstLogin) {
				selectedPoints = that.checkpointData;
			}

			_.each(selectedPoints, function(point, index) {
				let icon = new AMap.Icon({
					size: new AMap.Size(25, 25),
					image: "/static/icons/" + point.type + ".png",
					imageSize: new AMap.Size(25, 25)
				});

				let marker = new AMap.Marker({
					// anchor: 'bottom-center',
					position: new AMap.LngLat(point.lon, point.lat),
					icon: icon,
					// offset: new AMap.Pixel(-13, -25),
					title: point.checkPointName,
					bubble: true,
					topWhenClick: true,
					extData: point
				});
				marker.on("click", function(e) {
					let p = e.target;
					that.pointForm = p.getExtData();
					let photoNames = that.pointForm.photo
						? that.pointForm.photo.split("；")
						: [];
					let baseUrl = backendUrl + "/image/";
					that.photos = [];

					_.each(photoNames, function(name) {
						let photoObj = {
							name: name,
							src: baseUrl + that.uploadPhotoData.reportNum + "/" + name
						};
						that.photos.push(photoObj);
					});

					that.isPoint = true;
					that.csDetailPanel.right = '50px'
				});
				points.push(marker);
			});
			let overlayGroups = new AMap.OverlayGroup(points);
			this.map.add(overlayGroups);
		},
		renderLine() {
			let that = this;
			let lines = [];

			_.each(that.pipelineData, function(pipe, index) {
				let strokeWeight = 2;
				let isOutline = false;
				if (_.findIndex(that.multipleSelectedLine, pipe) > -1) {
					strokeWeight = 4;
					isOutline = true;
				}
				if (that.isFirstLogin) {
					strokeWeight = 4;
					isOutline = true;
				}
				let pipeline = new AMap.Polyline({
					path: pipe.pipePaths,
					cursor: "pointer",
					strokeColor: pipe.strokeColor,
					isOutline: isOutline,
					borderWeight: 4,
					outlineColor: "#ffff00",
					strokeOpacity: 1,
					strokeWeight: strokeWeight,
					// 折线样式还支持 'dashed'
					strokeStyle: "solid",
					// strokeStyle是dashed时有效
					// strokeDasharray: [6, 4],
					lineJoin: 'round',
					lineCap: 'round',
					zIndex: 8,
					extData: pipe
				});
				pipeline.on("click", function(e) {
					let p = e.target;
					that.lineForm = p.getExtData();
					that.isPoint = false;
					that.csDetailPanel.right = '50px'
				});
				lines.push(pipeline);
			});

			_.each(that.orphanSegmentData, function(pipe, index) {
				let strokeWeight = 2;
				let isOutline = false;

				let pipeline = new AMap.Polyline({
					path: pipe.pipePaths,
					cursor: "pointer",
					strokeColor: pipe.strokeColor,
					// strokeColor: "#f00",
					isOutline: isOutline,
					borderWeight: 4,
					outlineColor: "#ffff00",
					strokeOpacity: 1,
					strokeWeight: strokeWeight,
					// 折线样式还支持 'dashed'
					strokeStyle: "solid",
					// strokeStyle是dashed时有效
					// strokeDasharray: [6, 4],
					lineJoin: 'round',
					lineCap: 'round',
					zIndex: 8,
					extData: pipe
				});
				pipeline.on("click", function(e) {
					let p = e.target;
					that.lineForm = p.getExtData();
					that.isPoint = false;
					that.csDetailPanel.right = '50px'
				});
				lines.push(pipeline);
			});

			let overlayGroups = new AMap.OverlayGroup(lines);
			this.map.add(overlayGroups);
		},
		amapView() {
			let that = this;
			that.map = new AMap.Map("map-box", {
				resizeEnable: true,
				zoom: 11,
				center: ["116.537812", "40.02218045"],
				viewMode: "3D"
			});
			that.map.plugin(["AMap.ToolBar", "AMap.MapType"], function() {
				that.map.addControl(new AMap.ToolBar());
			});

			that.map.clearMap();

			that.map.setFitView();
		},
		goToDetail() {
			this.$router.push({ path: "detail" });
		},
		onShare() {
			this.$copyText(`${window.location.href}`).then(
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

<style scoped>
	.cs-home-box{
		width:100%; 
		height: 100%;
		overflow:hidden;
		position: relative;
	}
	.cs-toggle-btn {
		box-sizing: border-box;
    padding-top: 12px;
    padding-right: 20px;
		font-size: 24px;
		color: #3a8ee6;
		cursor: pointer;
		position: absolute;
    background: #fcf9f2;
    width: 50px;
    height: 50px;
    left: -25px;
    top: 42%;
    border-radius: 50%;
    box-shadow: 1px 1px 8px #000;
		z-index: 0;
	}
	.cs-toggle-btn-shade {
		position: absolute;
    background: #fcf9f2;
    width: 50px;
    height: 80px;
    left: 0px;
    top: 40%;
    z-index: 1;
	}
	.cs-title {
		position: absolute;
		left: 70px;
		top: 20px;
		background: #fcf9f2;
		border-radius: 5px;
		box-shadow: 1px 1px 8px #000;
	}
	.cs-panel {
		position: absolute;
		right: -500px;
		top: 20px;
		width: 500px;
		height: 550px;
		background: #fcf9f2;
		padding: 0;
		margin: 0;
		border-radius: 5px;
		box-shadow: 1px 1px 8px #000;
		transition: right .8s;
	}
	.cs-panel-title {
		font-size: 20px;
		font-weight: bold;
		height: 50px;
		line-height: 50px;
	}
	.cs-panel-btn {
		position: absolute;
		left: 515px;
		top: 30px;
		height: 40px;
		line-height: 40px;
	}
	.cs-info-h3 {
		margin: 10px 0;
	}

	.cs-home-box >>> .el-carousel__container {
		height: 200px;
	}

	.cs-home-box >>> .el-form-item__label {
		font-weight: bold;
	}

	.cs-home-box >>> .el-form-item--mini.el-form-item, 
	.cs-home-box >>> .el-form-item--small.el-form-item {
		margin-bottom: 2px;
	}

	.cs-home-box >>> .el-carousel__item h3 {
		color: #475669;
		font-size: 18px;
		opacity: 0.75;
		margin: 0;
	}
	.cs-home-box >>> .el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}
	.cs-home-box >>> .el-carousel__item:nth-child(2n + 1) {
		background-color: #d3dce6;
	}
</style>
