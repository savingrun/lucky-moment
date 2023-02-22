// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let uid = event.uid
    let rankTypeList = event.rankTypeList
    let gachaTypeList = event.gachaTypeList
    const _ = db.command
    const $ = db.command.aggregate
    let count = await db.collection('genshin_gacha_record')
        .aggregate()
        .match({
            uid: uid,
            rank_type: _.in(rankTypeList),
            gacha_type: _.in(gachaTypeList)
        })
        .group({
            _id: null,
            count: $.sum(1),
        })
        .project({
            _id: 0,
        })
        .end()
        .then(res => {
            console.log("count:" + res.list[0].count)
            return res.list[0].count
        }).catch(err => {
            console.log("count err:" + err)
            return 0
        })
    return await db.collection('genshin_gacha_record')
        .aggregate()
        .match({
            uid: uid,
            rank_type: _.in(rankTypeList),
            gacha_type: _.in(gachaTypeList)
        })
        .sort({
            time: -1
        })
        .limit(count)
        .end()
        .then(res => {
            // console.log("res:" + res.list)
            return res.list
        }).catch(err => {
            console.log("err:" + err)
            return []
        })
}