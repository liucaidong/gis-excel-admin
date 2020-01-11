import Vue from 'vue'
import Vuex from 'vuex'

import AMap from 'AMap'

Vue.use(Vuex)

import backendUrl from '../config'

import axios from "axios"
axios.defaults.baseURL = backendUrl
axios.defaults.withCredentials = true

export default new Vuex.Store({
    state: {
        isFirstLogin: true,
        checkpointData: [],
        reportData: [],
        pipelineData: [],
        segmentData: [],
        orphanSegmentData: [],
        multipleSelectedPoint: [],
        multipleSelectedLine: [],
        uploadPhotoData: {
            reportNum: ""
        },
        pipelineColor: {
            "高压A": "#E600A9",
            "高压B": "#000000",
            "次高压A": "#FF0000",
            "次高压B": "#FF0000",
            "中压A": "#0000FF",
            "中压B": "#0000FF",
            "低压": "#266400"
        },

    },
    mutations: {
        setIsFirstLogin(state, payload) {
            state.isFirstLogin = payload
        },
        setcheckpointData(state, payload) {
            state.checkpointData = payload
        },
        setreportData(state, payload) {
            state.reportData = payload
        },
        setpipelineData(state, payload) {
            state.pipelineData = payload
        },
        setsegmentData(state, payload) {
            state.segmentData = payload
        },
        setorphanSegmentData(state, payload) {
            state.orphanSegmentData = payload
        },
        setmultipleSelectedPoint(state, payload) {
            state.multipleSelectedPoint = payload
        },
        setmultipleSelectedLine(state, payload) {
            state.multipleSelectedLine = payload
        },
        setuploadPhotoData(state, payload) {
            state.uploadPhotoData.reportNum = payload
        }
    },
    actions: {
        async reloadAllData({ dispatch }) {
            await dispatch('getCheckpoint')
            await dispatch('getReport')
            await dispatch('getPipeline')
        },
        async getCheckpoint({ commit }) {
            await axios.get("/excel/checkpoint", {}).then((res) => {
                let data = res.data
                let len = data.length
                let convertNum = 0
                _.each(data, function(item){
                    AMap.convertFrom([parseFloat(item.lon), parseFloat(item.lat)], 'gps', function (status, result) {
                        if (result.info === 'ok') {
                            convertNum++
                            let lnglats = result.locations
                            item.lon = lnglats[0].lng
                            item.lat = lnglats[0].lat
                            if(convertNum == len){
                                commit('setcheckpointData', data)
                            }
                        }
                    })
                })
            })
        },
        async getReport({ commit }) {
            await axios.get("/excel/report", {}).then((res) => {
                var data = res.data
                commit('setreportData', data)
                commit('setuploadPhotoData', !data[0] ? "" : data[0]["reportNum"])
            })
        },
        async getPipeline({ dispatch, commit, state }) {
            await axios.get("/excel/pipeline", {}).then(async(res) => {
                var data = res.data
                await dispatch('getSegment', data)
            })
        },
        async getSegment({ commit, state }, pipelineData) {
            await axios.get("/excel/segment", {}).then((res) => {
                var data = res.data
                let len = data.length
                let convertNum = 0
                _.each(data, function(item){
                    AMap.convertFrom([
                        [parseFloat(item.startL), parseFloat(item.startB)],
                        [parseFloat(item.endL), parseFloat(item.endB)]
                    ], 'gps', function (status, result) {
                        if (result.info === 'ok') {
                            convertNum++
                            let lnglats = result.locations
                            item.startL = lnglats[0].lng
                            item.startB = lnglats[0].lat
                            item.endL = lnglats[1].lng
                            item.endB = lnglats[1].lat
                            if(convertNum == len){
                                commit('setsegmentData', data)

                                let orphanSegmentArr = _.cloneDeep(state.segmentData)

                                _.each(pipelineData, function(pipeline) {
                                    let pipePaths = []
                                    _.each(state.segmentData, function(segment) {
                                        if (segment.pipeNum == pipeline.pipeNum) {
                                            pipePaths.push(new AMap.LngLat(segment.startL, segment.startB))
                                            pipePaths.push(new AMap.LngLat(segment.endL, segment.endB))
                                            _.remove(orphanSegmentArr, function(orphanSeg) {
                                                return orphanSeg.id == segment.id
                                            })
                                        }
                                    })
                                    pipeline.pipePaths = pipePaths
                                    pipeline.strokeColor = state.pipelineColor[pipeline.pressLevel]
                                })

                                if(_.isArray(orphanSegmentArr) && orphanSegmentArr.length > 0){
                                    _.each(orphanSegmentArr, function(orphanSegment) {
                                        let pipePaths = []
                                        pipePaths.push(new AMap.LngLat(orphanSegment.startL, orphanSegment.startB))
                                        pipePaths.push(new AMap.LngLat(orphanSegment.endL, orphanSegment.endB))
                                        orphanSegment.pipePaths = pipePaths
                                        orphanSegment.strokeColor = state.pipelineColor[orphanSegment.pressLevel]
                                    })
                                }

                                commit('setorphanSegmentData', orphanSegmentArr)
                                commit('setpipelineData', pipelineData)
                                
                            }
                        }
                    })
                })
            })
        },
        getmultipleSelectedPoint({ commit }, data) {
            commit('setmultipleSelectedPoint', data)
        },
        getMultipleSelectedLine({ commit }, data) {
            commit('setmultipleSelectedLine', data)
        },
        getuploadPhotoData({ commit }, data) {
            commit('setuploadPhotoData', data)
        }
    },
    modules: {}
})