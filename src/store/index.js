import Vue from 'vue'
import Vuex from 'vuex'

import AMap from 'AMap'

Vue.use(Vuex)

import axios from "axios"
axios.defaults.baseURL = 'http://localhost:8080/excel/'
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
        async getCheckpoint({ commit }) {
            await axios.get("checkpoint", {}).then((res) => {
                var data = res.data
                commit('setcheckpointData', data)
            })
        },
        async getReport({ commit }) {
            await axios.get("report", {}).then((res) => {
                var data = res.data
                commit('setreportData', data)
                commit('setuploadPhotoData', data[0]["reportNum"])
            })
        },
        async getPipeline({ dispatch, commit, state }) {
            await axios.get("pipeline", {}).then(async(res) => {
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
                })

                commit('setpipelineData', data)
            })
        },
        async getSegment({ commit }) {
            await axios.get("segment", {}).then((res) => {
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