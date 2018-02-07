function getMsgs(msgs) {
    let result = [];
    for (let i = 0; i < msgs.length; i++) {

        // 只发给一个人
        if (msgs[i].SEND_TO.indexOf(',') < 0) {
            result.push(formatMsg(msgs[i], msgs[i].SEND_TO, i));
        } else {
            // 发给多个人
            let temp = msgs[i].SEND_TO.split(',');
            temp.forEach((value, index) => {
                result.push(formatMsg(msgs[i], temp[index], i));
            });
        }
    }
    return result;
}

function formatMsg(msg, sendTo, index = 0) {
    return {
        TO_USER_NAME: sendTo || msg.SEND_TO,
        FROM_USER_NAME: 'alert',
        TEXT: msg.TEXT,
        CONTENT: msg.CONTENT,
        CONTENT_TYPE: msg.CONTENT_TYPE,
        TIME: (Date.parse(new Date().toString()) + index).toString(),
        EXTRA: {
            type: msg.TYPE,
            title: msg.TITLE,
            content_type: msg.CONTENT_TYPE,
            content: msg.CONTENT,
            table_content: msg.TABLE_CONTENT,
            params: msg.PARAMS
        }
    };
}


module.exports = {
    getMsgs
}

// msgs.push({
//     TO_USER_NAME: 'jinzhi.he',
//     FROM_USER_NAME: 'alert',
//     TEXT: '小夜班巡檢問題已改善',
//     CONTENT: '尊敬的高海玲,陳智勇：2018/01/26小夜班巡檢發現：S11-4F,仓库多处缺天花板，已改善。原因分析:天花板壞掉.整改措施:請廠務更換.謝謝！點擊消息可查看詳情。',
//     CONTENT_TYPE: 'text',
//     TIME: Date.parse(new Date().toString()).toString(),
//     EXTRA: {
//         type: 'ipqa',
//         title: '小夜班巡檢問題已改善',
//         content_type: 'text',
//         content: '尊敬的高海玲,陳智勇：2018/01/26小夜班巡檢發現：S11-4F,仓库多处缺天花板，已改善。原因分析:天花板壞掉.整改措施:請廠務更換.謝謝！點擊消息可查看詳情。',
//         table_content: 'issue_detail',
//         params: '[{"LINE_ID":"5093","INSPECT_DATE":"2018/01/26","INSPECT_TIME":"18:37","LOCATION":"S11-4F","PROBLEM_FLAG":"Y","PROBLEM_DESC":"仓库多处缺天花板","PROBLEM_PICTURES":"Images/IPQA/2018-01/3752d869-08ec-4cd1-b4ef-d5c1d8e920db.png","PROBLEM_STATUS":"Done","OWNER_EMPNO":"25354","SCORE":"","ACTION_DESC":"天花板壞掉","ACTION_DATE":"2018/02/05","ACTION_STATUS":"請廠務更換","ACTION_PICTURES":"Images/IPQA/2018-02/0f2cf012-6996-4cb6-aef0-47748070076f.png","INSPECT_PERSON":"李秀山,陳靜強"}]'
//     }
// });