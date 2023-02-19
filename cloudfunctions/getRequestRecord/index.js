// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const $ = db.command.aggregate
    return db.collection('genshin_request_record')
        .aggregate()
        .match({
            openid: wxContext.OPENID
        })
        .sort({
            create_time: -1
        })
        .group({
            _id: '$uid',
            create_time: $.first('$create_time')
        })
        .project({
            _id: 0,
            uid: '$_id',
            create_time: $.dateToString({
                date: '$create_time',
                format: '%Y年%m月%d日 %H:%M:%S',
                onNull: 'null',
                timezone: 'Asia/Shanghai'
            })
        })
        .sort({
          create_time: -1
        })
        .end()
        .then(res => {
            console.log("res:" + res.list)
            return res.list
        }).catch(err => {
            console.log("err:" + err)
            return []
        })
}