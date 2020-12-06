var myModalVue;
$(document).ready(function () {
    myModalVue = new Vue({
        el: ".myModal-container",
        data: {
            show: false,
            template: 0,
            state: ["", ""],
            errMsg: ["", ""],
            clubName: "",
            HQName: "",
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
            close: function () { this.show = false },
            getInviteCode: function () {
                myVue.getInviteCode();
            },
            addHQ: function () {
                var that = this;
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
                                    state: ["success"]
                                })
                                break;
                            default:
                                myModal.show({
                                    template: 2,
                                    state: ["fail"],
                                    errMsg: response.result
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
                                    state: ["success"]
                                });
                                break;
                            default:
                                myModal.show({
                                    template: 2,
                                    state: ["fail"],
                                    errMsg: response.result
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
            actionRoute: function (type) {
                if (type == 1) this.addHQ;
                    else this.edit;
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