// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let gachaList = event.gachaList;
    for (item of gachaList) {
        db.collection('genshin_gacha_record').add({
            data: {
                uid: item.uid,
                gacha_type: item.gacha_type,
                item_id: item.item_id,
                count: item.count,
                time: new Date(item.time),
                name: item.name,
                lang: item.lang,
                item_type: item.item_type,
                rank_type: item.rank_type,
                id: item.id,
                openid: wxContext.OPENID,
                appid: wxContext.APPID,
                client_ip: wxContext.CLIENTIP,
                client_ipv6: wxContext.CLIENTIPV6
            }
        }).then(res => {
            console.log("res:" + res.errMsg)
        }).catch(err => {
            console.log("err:" + err)
        })
        if (item.rank_type == "5") {
            db.collection('genshin_gacha_special_record').add({
                data: {
                    uid: item.uid,
                    gacha_type: item.gacha_type,
                    item_id: item.item_id,
                    count: item.count,
                    time: new Date(item.time),
                    name: item.name,
                    lang: item.lang,
                    item_type: item.item_type,
                    rank_type: item.rank_type,
                    id: item.id,
                    openid: wxContext.OPENID,
                    appid: wxContext.APPID,
                    client_ip: wxContext.CLIENTIP,
                    client_ipv6: wxContext.CLIENTIPV6
                }
            }).then(res => {
                console.log("genshin_gacha_special_record_res:" + res.errMsg)
            }).catch(err => {
                console.log("genshin_gacha_special_record_err:" + err)
            })
        }
    }

    db.collection('genshin_request_record').add({
        data: {
            uid: gachaList[0].uid,
            openid: wxContext.OPENID,
            appid: wxContext.APPID,
            client_ip: wxContext.CLIENTIP,
            client_ipv6: wxContext.CLIENTIPV6,
            create_time: new Date()
        }
    }).then(res => {
        console.log("genshin_gacha_special_record_res:" + res.errMsg)
    }).catch(err => {
        console.log("genshin_gacha_special_record_err:" + err)
    })

    return '同步成功'
}