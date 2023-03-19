// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const _ = db.command
    const $ = db.command.aggregate
    return await db.collection('genshin_gacha_special_record')
        .aggregate()
        .match({
            rank_type: '5',
            gacha_type: _.in(['301', '400'])
        })
        .group({
          _id: '$time',
          total: $.sum (1),
          firstName: $.first('$name'),
          names: $.push('$name'),
          infos: $.push({
            id: '$id',
            item_type: '$item_type',
            name: '$name'
          })
        })
        .project({
          _id: 0,
          time: $.dateToString({
            date: '$_id',
            format: '%Y/%m/%d %H:%M:%S',
            onNull: 'null',
            timezone: 'Asia/Shanghai'
          }),
          total: '$total',
          firstName: '$firstName',
          names: '$names',
          infos: '$infos'
        })
        .sort({
          time: -1
        })
        .end()
        .then(res => {
            console.log("res:" + res.list)
            return res.list
        }).catch(err => {
            console.log("res:" + err)
            return []
        })
}