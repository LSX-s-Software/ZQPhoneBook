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
            HQName: ""
        },
        mounted() {
            window.vue = this
        },
        methods: {
            backToMyClub: function () {
                $('#tree').treeview('selectNode', [0]);
                this.close()
            },
            retry: function () { console.error("Method retry Not Implemented.") },
            close: function () { myModal.close() }
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

        myModalVue.show = true
    }

    /** 关闭弹窗
    * @todo 增加动画
    */
    close() {
        myModalVue.show = false
    }
}