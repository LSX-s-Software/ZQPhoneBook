var queryString = window.location.search.split("&");
var myVue;
$(document).ready(function () {
    myVue = new Vue({
        el: ".mainContainer",
        data: {
            onEdit: false,
            myInfo: {
                name: "",
                nickName: "",
                avatarURL: "src/img/person.png",
                gender: 0,
                birthday: "",
                hometown: "",
                university: "",
                school: "",
                grade: "",
                schoolNumber: "",
                phone: "",
                email: "",
                qq: "",
                wechat: "",
                dormBuilding: "",
                marrige: false
            },
            fromReg: queryString.indexOf("?from=register") != -1
        },
        mounted() {
            if (this.fromReg) {
                queryString.forEach(str => {
                    if (str.substring(0, 5) == "email") {
                        this.myInfo.email = str.split("=")[1];
                    }
                })
                this.onEdit = true;
            } else {
                var that = this;
                $.ajax({
                    type: "POST",
                    url: "/userInfo/getMyInfo",
                    data: {
                        Token: "",
                        detail: true
                    },
                    success: function (response) {
                        switch (response) {
                            case "success":
                                that.myInfo = response.myInfo;
                                break;
                            default:
                                alert(response);
                                break;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        alert(textStatus + ":" + jqXHR.statusText + " " + errorThrown);
                        that.myInfo = {
                            name: "王三三",
                            nickName: "鱼子酱",
                            avatarURL: "src/img/avatar.png",
                            gender: 1,
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
                });
            }
        },
        watch: {
            onEdit: function (onEdit) {
                var that = this;
                if (!onEdit) {
                    var formFile = new FormData();
                    formFile.append("avatar", this.avatarURL);
                    formFile.append("Token", "");
                    formFile.append("myInfo", this.myInfo);
                    $.ajax({
                        type: "POST",
                        url: "/userInfo/setMyInfo",
                        processData: false,
                        contentType: false,
                        data: formFile,
                        success: function (response) {
                            switch (response) {
                                case "success":
                                    alert("个人信息编辑成功");
                                    if (that.fromReg) {
                                        window.location.href = "main.html";
                                    }
                                    break;
                                default:
                                    alert(response);
                                    that.onEdit = true;
                                    break;
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error(jqXHR);
                            alert(textStatus + ":" + jqXHR.statusText + " " + errorThrown);
                            that.onEdit = true;
                        }
                    });
                }
            }
        }
    })
});

function avatarChanged(obj) {
    console.log(obj.files[0]);
    myVue.myInfo.avatarURL = window.URL.createObjectURL(obj.files[0]);
}