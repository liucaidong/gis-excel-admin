import Vue from 'vue'
import Vuex from 'vuex'

import AMap from 'AMap'

Vue.use(Vuex)

import axios from "axios"
// axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials = true


export default new Vuex.Store({
    state: {
        checkpointData: [],
        reportData: [],
        pipelineData: [],
        segmentData: [],
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
                var data = res.data
                commit('setcheckpointData', data)
            })
        },
        async getReport({ commit }) {
            await axios.get("/excel/report", {}).then((res) => {
                var data = res.data
                commit('setreportData', data)
                commit('setuploadPhotoData', data[0]["reportNum"])
            })
        },
        async getPipeline({ dispatch, commit, state }) {
            await axios.get("/excel/pipeline", {}).then(async(res) => {
                var data = res.data
                await dispatch('getSegment')

                _.each(data, function(pipeline) {
                    let pipePaths = []
                    _.each(state.segmentData, function(segment) {
                        if (segment.pipeNum == pipeline.pipeNum) {
                            pipePaths.push(new AMap.LngLat(segment.startL, segment.startB))
                            pipePaths.push(new AMap.LngLat(segment.endL, segment.endB))
                        }
                    })
                    pipeline.pipePaths = pipePaths
                    pipeline.strokeColor = state.pipelineColor[pipeline.pressLevel]
                })

                commit('setpipelineData', data)
            })
        },
        async getSegment({ commit }) {
            await axios.get("/excel/segment", {}).then((res) => {
                var data = res.data
                commit('setsegmentData', data)
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