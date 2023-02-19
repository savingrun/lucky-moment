// index.js
const app = getApp()
const {
    envList
} = require('../../envList.js')
import Toast, {
    hideToast
} from 'tdesign-miniprogram/toast/index';
import Message from 'tdesign-miniprogram/message/index';

Component({
    data: {
        scrollViewHeight: 0,
        rolePoolDataFlag: true,
        weaponPoolDataFlag: true,
        permanentPoolDataFlag: true,
        contentUrl: '',
        ssrList: [0],
        tabPanelstyle: 'display:flex; justify-content:center; align-items:center; min-height:120px;',
        copyright: 'Saving © 2021-2031 TD.All Rights Reserved.',
        rolePoolList: [],
        weaponPoolList: [],
        permanentPoolList: [],
        dynamicMessages: ''
    },
    methods: {
        onLoad(options) {
            var that = this
            console.log(wx.getSystemInfoSync().windowHeight)
            that.setData({
                envId: options.envId,
                scrollViewHeight: wx.getSystemInfoSync().windowHeight / 1.5
            })
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

        analyse(e) {
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
                            switch (index) {
                                case 1:
                                    that.setData({
                                        uid: 'UID: ' + reply.data.list[0].uid,
                                        weaponPoolList: that.data.weaponPoolList.concat(reply.data.list),
                                        weaponPoolDataFlag: false,
                                        dynamicMessages: '分析武器池第 ' + page + dynamicMessagesAfter
                                    })
                                    break
                                case 2:
                                    that.setData({
                                        uid: 'UID: ' + reply.data.list[0].uid,
                                        permanentPoolList: that.data.permanentPoolList.concat(reply.data.list),
                                        permanentPoolDataFlag: false,
                                        dynamicMessages: '分析常驻池第 ' + page + dynamicMessagesAfter
                                    })
                                    break
                                default:
                                    that.setData({
                                        uid: 'UID: ' + reply.data.list[0].uid,
                                        rolePoolList: that.data.rolePoolList.concat(reply.data.list),
                                        rolePoolDataFlag: false,
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
                        if (reply.data == null) {
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

    },
})