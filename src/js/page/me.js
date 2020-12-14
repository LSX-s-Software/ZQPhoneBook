if (!localStorage.getItem("Token")) window.location.href = "index.html";
var queryString = window.location.search.split("&");
var myVue;
$(document).ready(function () {
    myVue = new Vue({
        el: ".mainContainer",
        data: {
            Token: localStorage.getItem("Token"),
            onEdit: false,
            myInfo: {
                name: "",
                nickName: "",
                avatarURL: "./src/img/person.png",
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
                        Token: this.Token,
                        detail: true
                    },
                    success: function (response) {
                        switch (response.result) {
                            case "success":
                                that.myInfo = response.myInfo;
                                break;
                            default:
                                alert(response.result);
                                break;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        alert(textStatus + ":" + jqXHR.statusText + " " + errorThrown);
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
                    formFile.append("Token", this.Token);
                    formFile.append("myInfo", JSON.stringify(this.myInfo));
                    $.ajax({
                        type: "POST",
                        url: "/userInfo/setMyInfo",
                        processData: false,
                        contentType: false,
                        data: formFile,
                        success: function (response) {
                            switch (response.result) {
                                case "success":
                                    alert("个人信息编辑成功");
                                    if (that.fromReg) {
                                        window.location.href = "main.html";
                                    }
                                    break;
                                default:
                                    alert(response.result);
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
        },
        methods: {
            logout: function () {
                localStorage.removeItem("Token");
                window.location.href = "index.html";
            },
            uploadAvatar: function () {
                if (this.onEdit) $('#imgUploadInput').click();
            }
        }
    })
});

function avatarChanged(obj) {
    console.log(obj.files[0]);
    myVue.myInfo.avatarURL = window.URL.createObjectURL(obj.files[0]);
}