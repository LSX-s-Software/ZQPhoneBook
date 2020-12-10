var myModalVue;
$(document).ready(function () {
    myModalVue = new Vue({
        el: ".myModal-container",
        data: {
            Token: myVue.Token,
            show: false,
            template: 0,
            state: ["", ""],
            errMsg: ["", ""],
            clubName: "",
            HQName: "",
            phone: "",
            inviteCode: "",
            param: null
        },
        mounted() {
            window.vue = this
        },
        methods: {
            backToMyClub: function () {
                $('#tree').treeview('selectNode', [0]);
                this.close()
            },
            retry: function () {
                switch (this.template) {
                    case 1:
                        this.close();
                        myVue.joinClub();
                    case 2:
                        this.close();
                        myVue.createClub();
                        break;
                    default:
                        break;
                }
            },
            close: function () {
                this.show = false;
                this.template = 0;
                this.param = null;
            },
            getInviteCode: function () {
                myVue.getInviteCode();
            },
            addHQ: function () {
                $.ajax({
                    type: "POST",
                    url: "/clubs/addHQ",
                    data: {
                        Token: this.Token,
                        name: this.HQName,
                        id: this.param.id
                    },
                    success: function (response) {
                        switch (response.result) {
                            case "success":
                                myModal.show({
                                    template: 2,
                                    state: ["success"],
                                    type: ["add", "hq"]
                                })
                                myVue.getMyClub();
                                break;
                            default:
                                myModal.show({
                                    template: 2,
                                    state: ["fail"],
                                    type: ["add", "hq"],
                                    errMsg: [response.result]
                                })
                                break;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        alert(textStatus + ": " + jqXHR.statusText + " " + errorThrown, "");
                    }
                });
            },
            edit: function () {
                $.ajax({
                    type: "POST",
                    url: "/clubs/editHQ",
                    data: {
                        Token: this.Token,
                        name: this.HQName,
                        id: this.param.id
                    },
                    success: function (response) {
                        switch (response.result) {
                            case "success":
                                myModal.show({
                                    template: 2,
                                    type: ["edit", "hq"],
                                    state: ["success"]
                                });
                                myVue.getMyClub();
                                break;
                            default:
                                myModal.show({
                                    template: 2,
                                    state: ["fail"],
                                    type: ["edit", "hq"],
                                    errMsg: [response.result]
                                });
                                break;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        alert(textStatus + ": " + jqXHR.statusText + " " + errorThrown, "");
                    }
                });
            },
            addMember: function () {
                $.ajax({
                    type: "POST",
                    url: "/clubs/addMember",
                    data: {
                        Token: this.Token,
                        phone: this.phone,
                        id: this.param.id
                    },
                    success: function (response) {
                        switch (response.result) {
                            case "success":
                                myModal.show({
                                    template: 2,
                                    type: ["add", "member"],
                                    state: ["success"]
                                });
                                myVue.getHQInfo(myVue.currentHQId);
                                break;
                            case "userNotExist":
                                myModal.show({
                                    template: 2,
                                    type: ["add", "member"],
                                    state: ["fail"],
                                    errMsg: ["用户不存在"]
                                });
                                break;
                            case "userExisted":
                                myModal.show({
                                    template: 2,
                                    type: ["add", "member"],
                                    state: ["fail"],
                                    errMsg: ["用户已属于该部门"]
                                });
                                break;
                            default:
                                myModal.show({
                                    template: 2,
                                    state: ["fail"],
                                    type: ["add", "member"],
                                    errMsg: [response.result]
                                });
                                break;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        alert(textStatus + ": " + jqXHR.statusText + " " + errorThrown, "");
                    }
                });
            },
            manualAddMember: function () {
                myModal.show({
                    template: 3,
                    param: {
                        id: myVue.currentHQId,
                        type: ["add", "member"]
                    }
                });
            },
            actionRoute: function () {
                switch (this.param.type) {
                    case ["add", "hq"]:
                        this.addHQ();
                        break;
                    case ["edit", "hq"]:
                        this.edit();
                        break;
                    case ["add", "member"]:
                        this.addMember();
                        break;
                    default:
                        break;
                }
                this.close();
            }
        }
    });
});

class MyModal {
    /** 显示弹窗
    * @param {Object}settings 弹窗设置
    * @param {[Int]}settings.template 模版序号
    * @param {[String]}settings.state 状态
    * @param {String}settings.clubName [模版1][成功]社团名称
    * @param {[String]}settings.errMsg [失败]错误信息
    * @param {Function}settings.retry [失败]重试处理方法
    * @param {Object}settings.param 额外参数
    * @todo 增加动画
    */
    show(settings) {
        console.log(settings)
        myModalVue.template = settings.template || 0
        myModalVue.state = settings.state || ["", ""]
        myModalVue.errMsg = settings.errMsg || ["", ""]
        myModalVue.clubName = settings.clubName
        if (settings.retry != undefined) {
            myModalVue.methods.retry = settings.retry
        }
        myModalVue.param = settings.param

        myModalVue.show = true
    }

    /** 关闭弹窗
    * @todo 增加动画
    */
    close() {
        myModalVue.show = false
    }
}