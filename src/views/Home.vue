<template>
	<div class="home">
		<el-row>
			<el-col :span="24">
				<div class="cs-title">
					<span>{{title}}</span>
					<el-button size="medium" type="primary" plain @click="goToDetail">管理数据</el-button>
					<el-button size="medium" type="primary" plain @click="onShare">分享</el-button>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="16">
				<MyMap msg="Welcome to Your Vue.js App" />
			</el-col>
			<el-col :span="8">
				<div v-if="isPoint">
					<h3>检测点详情</h3>
					<el-form size="mini" label-position="right" label-width="160px" :model="pointForm">
						<el-form-item size="mini" label="检测点名称">
							<span>{{pointForm.name}}</span>
						</el-form-item>
						<el-form-item size="mini" label="检测点编号">
							<span>{{pointForm.num}}</span>
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
						<el-carousel-item v-for="item in 4" :key="item">
							<h3>{{ item }}</h3>
						</el-carousel-item>
					</el-carousel>
				</div>
				<div v-else>
					<h3>管线详情</h3>
					<el-form size="mini" label-position="right" label-width="160px" :model="lineForm">
						<el-form-item size="mini" label="测量工程名称">
							<span>{{lineForm.name}}</span>
						</el-form-item>
						<el-form-item size="mini" label="管线编号">
							<span>{{lineForm.num}}</span>
						</el-form-item>
						<el-form-item size="mini" label="运行介质">
							<span>{{lineForm.type}}</span>
						</el-form-item>
						<el-form-item size="mini" label="压力级制">
							<span>{{lineForm.lon}}</span>
						</el-form-item>
						<el-form-item size="mini" label="材质">
							<span>{{lineForm.lat}}</span>
						</el-form-item>
						<el-form-item size="mini" label="外径(mm)">
							<span>{{lineForm.remark}}</span>
						</el-form-item>
						<el-form-item size="mini" label="长度(m)">
							<span>{{lineForm.photo}}</span>
						</el-form-item>
					</el-form>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
// @ is an alias to /src
import MyMap from "@/components/MyMap.vue";

export default {
	name: "Home",
	components: {
		MyMap
	},
	created() {},
	data: function() {
		return {
			title: "请点击管理数据按钮上传表格和图片数据",
			isPoint: true,
			pointForm: {
				name: "aaa",
				num: "aaa",
				type: "aaa",
				lon: "aaa",
				lat: "aaa",
				remark: "aaa",
				photo: "aaa"
			},
			lineForm: {
				name: "aaa",
				num: "aaa",
				type: "aaa",
				lon: "aaa",
				lat: "aaa",
				remark: "aaa",
				photo: "aaa"
			}
		};
	},
	methods: {
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
.home {
	.cs-title {
		height: 80px;
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
}
</style>
