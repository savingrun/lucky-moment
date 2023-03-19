// index.js
const app = getApp()
const {
    envList
} = require('../../envList.js')
let dateUtil = require('../../util/dateUtil.js')
import Toast, {
    hideToast
} from 'tdesign-miniprogram/toast/index'
import Message from 'tdesign-miniprogram/message/index'

import {
    createElement
} from '@antv/f2'
import {
    jsx as _jsx
} from "@antv/f2/jsx-runtime"
import Chart from './chart'
const data = [{
        flagNum: 3,
        name: "已垫",
        time: "2023/03/09 00:23:41",
        type: "role"
    },
    {
        flagNum: 77,
        name: "夜兰",
        time: "2023/02/07 18:05:55",
        type: "role"
    },
    {
        flagNum: 77,
        name: "雷电将军",
        time: "2023/01/05 19:41:33",
        type: "role"
    },
    {
        flagNum: 85,
        name: "神里绫人",
        time: "2022/12/27 19:16:35",
        type: "role"
    },
    {
        flagNum: 69,
        name: "达达利亚",
        time: "2022/11/18 18:09:13",
        type: "role"
    },
    {
        flagNum: 78,
        name: "纳西妲",
        time: "2022/11/02 10:55:18",
        type: "role"
    },
    {
        flagNum: 71,
        name: "温迪",
        time: "2022/09/28 12:52:32",
        type: "role"
    },
    {
        flagNum: 45,
        name: "莫娜",
        time: "2022/09/28 12:51:20",
        type: "role"
    },
    {
        flagNum: 5,
        name: "已垫",
        time: "2023/03/09 00:23:40",
        type: "weapon"
    },
    {
        flagNum: 70,
        name: "天空之刃",
        time: "2023/02/17 06:35:27",
        type: "weapon"
    },
    {
        flagNum: 45,
        name: "波乱月白经津",
        time: "2022/12/27 19:15:26",
        type: "weapon"
    },
    {
        flagNum: 77,
        name: "已垫",
        time: "2023/03/09 00:23:40",
        type: "permanent"
    },
    {
        flagNum: 18,
        name: "天空之卷",
        time: "2022/11/01 10:31:26",
        type: "permanent"
    },
    {
        flagNum: 14,
        name: "阿莫斯之弓",
        time: "2022/09/28 12:49:55",
        type: "permanent"
    }
];

Page({
    data: {
        onRenderChart: () => {}
    },
});

Component({
    data: {
        scrollViewHeight: 0,
        rolePoolDataFlag: true,
        weaponPoolDataFlag: true,
        permanentPoolDataFlag: true,
        uploadCloudFlag: false,
        snapButtonFlag: true,
        contentUrl: '',
        ssrList: [0],
        tabPanelstyle: '/* display:flex; *//*justify-content:center*//*align-items:center*/min-height:120px;margin:32rpx;',
        copyright: 'Saving © 2023-2033 TD.All Rights Reserved.',
        rolePoolList: [],
        weaponPoolList: [],
        permanentPoolList: [],
        dynamicMessages: '',
        requestRecordList: [],
        skeletonLoading: true,
        analyseRolePoolList: [],
        analyseWeaponPoolList: [],
        analysePermanentPoolList: [],
        onRenderChart: () => {},
        chartList: [],
        analyseChartList: []
    },
    methods: {
        onLoad(options) {
            var that = this
            that.getAnalyseData()
            wx.cloud.callFunction({
                name: 'getRequestRecord',
                config: {
                    env: this.data.envId
                },
                success(res) {
                    console.log(res)
                    that.setData({
                        requestRecordList: res.result,
                        skeletonLoading: false
                    })
                },
                fail(err) {
                    console.log(err)
                },
                complete(res) {}
            })
            that.setData({
                envId: options.envId,
                scrollViewHeight: wx.getSystemInfoSync().windowHeight
            })
        },
        onReady() {
            this.setData({
                onRenderChart: () => {
                    return this.renderChart(data);
                }
            });
        },
        renderChart(data) {
            // return _jsx(Chart, {
            //   data: data
            // });
            // 如果不使用 jsx, 用下面代码效果也是一样的
            return createElement(Chart, {
                data: data,
            });
        },

        onShareAppMessage() {
            return {
                title: '欢迎欧皇',
                path: 'pages/index/index',
                imageUrl: ''
            }
        },

        onTabsChange(event) {
            console.log(`Change tab, tab-panel value is ${event.detail.value}.`)
        },

        onTabsClick(event) {
            console.log(`Click tab, tab-panel value is ${event.detail.value}.`)
        },

        contentUrl(e) {
            console.log(e.detail.value)
            var that = this
            that.setData({
                contentUrl: e.detail.value.replace(/\s+/g, '')
            })
        },

        getUrlParam(contentUrl, paramName) {
            let search = contentUrl.replace(/\?/, '')
            let reg = new RegExp('(^|&)' + paramName + '=(.*?)(&|$)')
            let res = search.match(reg)
            return res ? res[2] : null
        },

        snap(e) {
            var that = this
            console.log(that.data.contentUrl)
            if (that.data.contentUrl == '') {
                Toast({
                    context: that,
                    selector: '#t-toast-warning',
                    message: '分析连接不能为空',
                    theme: 'warning',
                    direction: 'column',
                })
                return
            }
            var authKey = that.getUrlParam(that.data.contentUrl, "authkey")
            console.log(authKey)
            var endId = 0
            var page = 1
            let size = 20
            // [301, 302, 200]
            let gachaTypeList = [301, 302, 200]
            var baseUrl = "https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog?win_mode=fullscreen&authkey_ver=1&sign_type=2&auth_appid=webview_gacha&init_type=301&timestamp=1673997960&lang=zh-cn&device_type=mobile&plat_type=ios&region=cn_gf01&game_biz=hk4e_cn" +
                "&authkey=" + authKey +
                "&size=" + size
            console.log(baseUrl)
            let dynamicMessagesBefore = '分析角色池第 '
            let dynamicMessagesAfter = ' 页'
            that.setData({
                dynamicMessages: dynamicMessagesBefore + page + dynamicMessagesAfter
            })
            Toast({
                context: that,
                selector: '#t-toast',
                theme: 'loading',
                direction: 'column',
                duration: 200000,
                preventScrollThrough: true,
            })
            var index = 0
            var intervalId = setInterval(function () {
                var currentUrl = baseUrl +
                    "&timestamp=" + Date.parse(new Date()) / 1000 +
                    "&page=" + page +
                    "&end_id=" + endId +
                    "&gacha_type=" + gachaTypeList[index]
                console.log(page)
                console.log(currentUrl)
                wx.request({
                    url: currentUrl,
                    header: {
                        'Host': 'hk4e-api.mihoyo.com',
                        'Origin': 'https://webstatic.mihoyo.com',
                        'Cookie': 'mi18nLang=zh-cn',
                        'Connection': 'keep-alive',
                        'Accept': 'application/json, text/plain, */*',
                        // 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
                        'Referer': 'https://webstatic.mihoyo.com/',
                        'Accept-Encoding': 'gzip, deflate, br'
                    },
                    timeout: 2000,
                    dataType: 'json',
                    method: 'GET',
                    success(res) {
                        var reply = res.data
                        console.log(reply)
                        if (reply.retcode == -101 || reply.retcode == -100) {
                            that.setData({})
                            hideToast({
                                context: that,
                                selector: '#t-toast',
                            })
                            Toast({
                                context: that,
                                selector: '#t-toast-warning',
                                message: reply.message,
                                theme: 'warning',
                                direction: 'column',
                            })
                            clearInterval(intervalId)
                        } else {
                            if (reply.data.list.length == 0) {
                                index++
                                page = 1
                                endId = 0
                                return
                            }
                            switch (index) {
                                case 1:
                                    that.setData({
                                        uid: 'UID: ' + reply.data.list[0].uid,
                                        weaponPoolList: that.data.weaponPoolList.concat(reply.data.list),
                                        dynamicMessages: '分析武器池第 ' + page + dynamicMessagesAfter
                                    })
                                    break
                                case 2:
                                    that.setData({
                                        uid: 'UID: ' + reply.data.list[0].uid,
                                        permanentPoolList: that.data.permanentPoolList.concat(reply.data.list),
                                        dynamicMessages: '分析常驻池第 ' + page + dynamicMessagesAfter
                                    })
                                    break
                                default:
                                    that.setData({
                                        uid: 'UID: ' + reply.data.list[0].uid,
                                        rolePoolList: that.data.rolePoolList.concat(reply.data.list),
                                        dynamicMessages: dynamicMessagesBefore + page + dynamicMessagesAfter
                                    })
                            }
                            // var initialValue = 0
                            // if (page >= 2) {
                            //     initialValue = page * size
                            // }
                            // for(let i = 0; i < reply.data.list.length; i++) {
                            //     let cur = reply.data.list[i]
                            //     console.log("initialValue:" + initialValue)
                            //     if(cur.rank_type == '5') {
                            //         console.log("====")
                            //         console.log(cur)
                            //         var list = that.data.ssrList
                            //         console.log(list)
                            //         list.push(i + initialValue)
                            //         console.log(list)
                            //         that.setData({
                            //             ssrList: list
                            //         });
                            //     }
                            // }
                            page++
                            endId = reply.data.list[reply.data.list.length - 1].id
                            if (reply.data.list.length < reply.data.size) {
                                index++
                                if (index < gachaTypeList.length) {
                                    page = 1
                                    endId = 0
                                } else {
                                    clearInterval(intervalId)
                                }
                            }
                        }
                    },
                    fail(err) {
                        console.log(err)
                        Toast({
                            context: that,
                            selector: '#t-toast-warning',
                            message: err,
                            theme: 'warning',
                            direction: 'column',
                        })
                    },
                    complete(res) {
                        var reply = res.data
                        if (reply.data.list.length == 0) {
                            return
                        }
                        if (reply.data.list.length < reply.data.size) {
                            if (index == gachaTypeList.length) {
                                console.log(that.data.rolePoolList)
                                console.log(that.data.weaponPoolList)
                                console.log(that.data.permanentPoolList)
                                hideToast({
                                    context: that,
                                    selector: '#t-toast',
                                })
                                that.setData({
                                    uploadCloudFlag: true,
                                    snapButtonFlag: false
                                })
                                that.analyse(that.data.rolePoolList, "role")
                                that.analyse(that.data.weaponPoolList, "weapon")
                                that.analyse(that.data.permanentPoolList, "permanent")
                            }
                        }
                    }
                })
            }, 700)

            // wx.cloud.callFunction({
            //     name: 'analyse',
            //     config: {
            //         env: this.data.envId
            //     },
            //     data: {
            //         url: this.data.contentUrl
            //     }
            // }).then((resp) => {
            //     console.log(resp.result)
            //     if (resp.result.retcode == -101) {
            //         this.setData({});
            //     } else if (resp.result.retcode == -100) {
            //         this.setData({});
            //     } else {
            //         this.setData({
            //             uid: 'UID: ' + resp.result.data.list[0].uid,
            //             genshinData: resp.result.data.list,
            //             rolePoolDataFlag: false
            //         });
            //     }
            //     hideToast({
            //         context: this,
            //         selector: '#t-toast',
            //     });
            // }).catch((e) => {
            //     hideToast({
            //         context: this,
            //         selector: '#t-toast',
            //     });
            // });
        },

        analyse(list, type) {
            var that = this
            console.log(list)
            var flagNum = 0
            var analyseList = []
            var chartList = []
            chartList = chartList.concat(that.data.chartList)
            for (let index = list.length - 1; index >= 0; index--) {
                const element = list[index];
                console.log(element)
                flagNum++
                if (element.rank_type == "5") {
                    console.log("***********")
                    console.log(element)
                    console.log("flagNum:" + flagNum)
                    analyseList.unshift({
                        info: element,
                        flagNum: flagNum
                    })
                    chartList.unshift({
                        // time: dateUtil.customFormatTime(element.time, 'h:m:s'),
                        time: element.time,
                        name: element.name,
                        flagNum: flagNum,
                        type: type
                    })
                    flagNum = 0
                    console.log("***********")
                }
                if (index == 0) {
                    analyseList.unshift({
                        info: null,
                        flagNum: flagNum
                    })
                    chartList.unshift({
                        // time: dateUtil.customFormatTime(new Date(), 'h:m:s'),
                        time: dateUtil.customFormatTime(new Date(), 'Y/M/D h:m:s'),
                        name: '已垫',
                        flagNum: flagNum,
                        type: type
                    })
                    console.log("flagNum:" + flagNum)
                }
            }
            // console.log("analyseList:")
            // console.log(analyseList)
            switch (type) {
                case "role":
                    that.setData({
                        analyseRolePoolList: analyseList,
                        rolePoolDataFlag: false,
                        chartList: chartList,
                        onRenderChart: () => {
                            return this.renderChart(chartList);
                        }
                    })
                    break
                case "weapon":
                    that.setData({
                        analyseWeaponPoolList: analyseList,
                        weaponPoolDataFlag: false,
                        chartList: chartList,
                        onRenderChart: () => {
                            return this.renderChart(chartList);
                        }
                    })
                    break
                default:
                    that.setData({
                        analysePermanentPoolList: analyseList,
                        permanentPoolDataFlag: false,
                        chartList: chartList,
                        onRenderChart: () => {
                            return this.renderChart(chartList);
                        }
                    })
            }
        },

        uploadCloud(e) {
            var that = this
            console.log(e)
            that.setData({
                dynamicMessages: '数据同步云端中...'
            })
            Toast({
                context: that,
                selector: '#t-toast',
                theme: 'loading',
                direction: 'column',
                duration: 2000,
                preventScrollThrough: true,
            })
            var roleList = this.data.rolePoolList
            var weaponList = this.data.weaponPoolList
            var permanentList = this.data.permanentPoolList
            var gachaList = roleList.concat(weaponList, permanentList)
            wx.cloud.callFunction({
                name: 'uploadCloud',
                config: {
                    env: this.data.envId
                },
                data: {
                    gachaList: gachaList
                },
                success(res) {
                    console.log(res)
                },
                fail(err) {
                    console.log(err)
                },
                complete(res) {
                    hideToast({
                        context: that,
                        selector: '#t-toast',
                    })
                    Message.success({
                        context: that,
                        offset: [20, 32],
                        duration: 1500,
                        content: '同步成功',
                        icon: 'check-circle-filled'
                    })
                }
            })
        },

        getHistoryRecord(event) {
            console.log(event.currentTarget.dataset.uid)
            var that = this
            that.setData({
                uid: 'UID: ' + event.currentTarget.dataset.uid,
                dynamicMessages: '获取数据中..'
            })
            Toast({
                context: that,
                selector: '#t-toast',
                theme: 'loading',
                direction: 'column',
                duration: 2200,
                preventScrollThrough: true,
            })
            that.getGachaRecordByUid(event.currentTarget.dataset.uid, "role")
            that.getGachaRecordByUid(event.currentTarget.dataset.uid, "weapon")
            that.getGachaRecordByUid(event.currentTarget.dataset.uid, "permanent")
            that.setData({
                snapButtonFlag: false
            })
        },

        getGachaRecordByUid(uid, type) {
            var that = this
            var rankTypeList = ['3', '4', '5']
            var gachaTypeList = []
            switch (type) {
                case "role":
                    gachaTypeList = ['301', '400']
                    break
                case "weapon":
                    gachaTypeList = ['302']
                    break
                default:
                    gachaTypeList = ['200']
            }
            wx.cloud.callFunction({
                name: 'getGachaRecordByUid',
                config: {
                    env: this.data.envId
                },
                data: {
                    uid: uid,
                    rankTypeList: rankTypeList,
                    gachaTypeList: gachaTypeList
                },
                success(res) {
                    that.analyse(res.result, type)
                },
                fail(err) {
                    console.log(err)
                },
                complete(res) {}
            })
        },

        clearData() {
            var that = this
            that.setData({
                rolePoolDataFlag: true,
                snapButtonFlag: true,
                uploadCloudFlag: false,
                rolePoolList: [],
                weaponPoolList: [],
                permanentPoolList: [],
                analyseRolePoolList: [],
                analyseWeaponPoolList: [],
                analysePermanentPoolList: [],
                chartList: []
            })
        },

        getAnalyseData() {
            var that = this
            wx.cloud.callFunction({
                name: 'getAnalyseData',
                config: {
                    env: this.data.envId
                },
                data: {
                },
                success(res) {
                    console.log('getAnalyseData:' + res)
                    that.setData({
                        analyseChartList: res.result,
                        chartList: res.result
                    })
                },
                fail(err) {
                    console.log(err)
                },
                complete(res) {}
            })
        },
    },
})