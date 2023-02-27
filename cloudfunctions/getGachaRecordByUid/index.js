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
        .project({
            _id: 0,
            id: '$id',
            uid: '$uid',
            gacha_type: '$gacha_type',
            item_id: '$item_id',
            count: '$count',
            time: $.dateToString({
                date: '$time',
                format: '%Y/%m/%d %H:%M:%S',
                onNull: 'null',
                timezone: 'Asia/Shanghai'
            }),
            name: '$name',
            lang: '$lang',
            item_type: '$item_type',
            rank_type: '$rank_type'
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