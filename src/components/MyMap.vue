<template>
  <div style="width:100%; height: 100%;">
    <div id="map-box" style="width:100%; height: 100%;"></div>
  </div>
</template>

<script>
import AMap from 'AMap'

export default {
  name: 'MyMap',
  data() {
    return {
      pipelineColor: {
        "高压A": "#f00",
        "高压B": "#ff0",
        "次高压A": "#f0f",
        "次高压B": "#0f0",
        "中压A": "#0ff",
        "中压B": "#00f",
        "低压": "#999"
      },
      checkpointIcon: {
        "阀门":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "绝缘接头":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "测试桩":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "阳极":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "破损点":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "泄漏点":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "异常点":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "转换接头":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "占压":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "生产作业":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "应急":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "测点":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "其他":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "凝水器":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "调压箱":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "调压站":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "开挖点":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "接线点":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "1级":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "2级":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "3级":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "4级":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "保护":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        "欠保护":"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png"
      }
    }
  },
  mounted() {
    this.amapView()
  },
  methods: {
    amapView() {
      const map = new AMap.Map('map-box', {
        resizeEnable: true,
        zoom: 11,
        center: ['116.537812', '40.02218045'],
        viewMode: '3D'
      })
      map.plugin(['AMap.ToolBar', 'AMap.MapType'], function(){
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.MapType({
          showTraffic: false,
          showRoad: false
        }))
      })

      map.setFitView()
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
