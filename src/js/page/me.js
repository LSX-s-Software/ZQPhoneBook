$(document).ready(function () {
    var myVue = new Vue({
        el: ".main",
        data: {
            onEdit: false,
            myInfo: {
                name: "王三三",
                nickName: "鱼子酱",
                avatarURL: "src/img/avatar.png",
                gender: "女",
                birthday: "2000-05-22",
                hometown: "湖北省武汉市",
                university: "武汉大学",
                school: "计算机学院",
                grade: "2020（本）",
                schoolNumber: "2020123456789",
                phone: 12345678901,
                email: "1234567890@163.com",
                qq: 12345678,
                wechat: "wxid_qwertyxxx123456",
                dormBuilding: "C0",
                marrige: false
            }
        }
    })
});