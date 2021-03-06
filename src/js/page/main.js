if (!localStorage.getItem("Token")) window.location.href = "index.html";
var treeData = [
    {
        text: '我的社团',
        tags: [''],
        icon: "myIcon icon-myClub",
        state: {
            selected: true
        },
        nodes: []
    },
    {
        text: '创建社团',
        icon: "myIcon icon-createClub"
    },
    {
        text: '加入社团',
        icon: "myIcon icon-joinClub"
    }
];
var myModal = new MyModal;
var myVue;
$(document).ready(function () {
    $(".mainContainer").css("opacity", 1);
    myVue = new Vue({
        el: ".mainContainer",
        data: {
            Token: localStorage.getItem("Token"),
            show: [true, false, false],
            nodeId: 0, //当前选中的treeview节点
            currentClubIndex: 0, //当前选中的社团的序号
            currentClubId: 0, //当前选中的社团的ID
            currentHQId: 0, //当前选中的部门ID
            listEditing: false,
            currentList: {
                subHQList: [],
                members: []
            },
            myInfo: {},
            myClubs: [],
            step: 1,
            clubName: "",
            clubDescription: "",
            clubBGImg: "./src/img/joinClubBG_dark.png",
            newClubId: "",
            inviteCode: "",
            showMemberInfoDialog: false,
            showSearchBox: false,
            searchHistory: [],
            searchText: "",
            memberInfo: null
        },
        mounted() {
            if (this.Token == undefined) return;
            var that = this;
            //获取个人信息
            $.ajax({
                type: "POST",
                url: "/userInfo/getMyInfo",
                data: {
                    Token: this.Token,
                    detail: false
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
                    alert(textStatus + ": " + jqXHR.statusText + " " + errorThrown);
                }
            });
            this.getMyClub();
        },
        watch: {
            nodeId: function (val) {
                console.log("Selected Node Id: " + val);
            },
            currentClubId: function (val) {
                console.log("Club Changed To " + val)
            },
            myClubs: function (val) {
                treeData[0].tags = [this.myClubs.length];
                var i = 0;
                treeData[0].nodes = [];
                this.myClubs.forEach(club => {
                    addIcon(club.hqs);
                    treeData[0].nodes.push({
                        id: club.id,
                        text: club.name,
                        tags: [club.size],
                        icon: "myIcon icon-club",
                        nodes: club.hqs
                    });
                });
                generateTree(treeData);
            }
        },
        //----------按钮点击事件-------------
        methods: {
            getTimePeriod: function () {
                var now = new Date()
                var hour = now.getHours()
                if (hour < 6) { return "凌晨" }
                else if (hour < 9) { return "早上" }
                else if (hour < 12) { return "上午" }
                else if (hour < 14) { return "中午" }
                else if (hour < 17) { return "下午" }
                else if (hour < 19) { return "傍晚" }
                else { return "晚上" }
            },
            getMyClub: function () { //获取加入的社团
                var that = this;
                $.ajax({
                    type: "POST",
                    url: "/userInfo/myClubs",
                    data: {
                        Token: this.Token
                    },
                    success: function (response) {
                        switch (response.result) {
                            case "success":
                                that.myClubs = response.myClubs || [];
                                break;
                            default:
                                alert(response.result);
                                break;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        alert("获取社团信息失败");
                    }
                });
            },
            createClub: function () {
                var that = this;
                var formFile = new FormData();
                formFile.append("img", this.clubBGImg);
                formFile.append("Token", this.Token);
                formFile.append("name", this.clubName);
                formFile.append("description", this.clubDescription);
                $.ajax({
                    url: "/clubs/addClub",
                    method: "POST",
                    processData: false,
                    contentType: false,
                    data: formFile,
                    success: function (data) {
                        if (data.result == "success") {
                            that.step = 2;
                            that.newClubId = data.id
                        } else {
                            myModal.show({
                                template: 2,
                                state: ["fail", ""],
                                type: ["add","club"],
                                errMsg: [data.result, ""]
                            })
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        myModal.show({
                            template: 2,
                            type: ["add","club"],
                            state: ["fail", ""],
                            errMsg: [textStatus + ": " + jqXHR.statusText + " " + errorThrown, ""]
                        })
                    }
                });
            },
            joinClub: function () {
                var that = this;
                $.ajax({
                    type: "POST",
                    url: "/clubs/join",
                    data: {
                        Token: this.Token,
                        inviteCode: this.inviteCode
                    },
                    success: function (response) {
                        var msg = "";
                        switch (response.result) {
                            case "success":
                                that.myClubs.push(response.myClubs);
                                myModal.show({
                                    template: 1,
                                    state: ["success", ""],
                                    errMsg: ["", ""],
                                    clubName: response.myClubs.name
                                });
                                return
                            case "invalidCode":
                                msg = "邀请码无效";
                                break;
                            case "accessDenied":
                                msg = "邀请码有效，但您不属于此社团";
                                break;
                            default:
                                msg = response.result;
                                break;
                        }
                        myModal.show({
                            template: 1,
                            state: ["fail", ""],
                            errMsg: [msg, ""]
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        myModal.show({
                            template: 1,
                            state: ["fail", ""],
                            errMsg: [textStatus + ": " + jqXHR.statusText + " " + errorThrown, ""]
                        });
                    }
                });
            },
            cardClicked: function (index) {
                myVue.currentClubIndex = index;
                $('#tree').treeview('selectNode', $('#tree').treeview('getNode', 0).nodes[index]);
            },
            addHQ: function () {
                console.log("Adding HQ at " + this.currentHQId);
                myModal.show({
                    template: 3,
                    param: {
                        id: this.currentHQId,
                        type: ["add","hq"]
                    }
                });
            },
            renewMember: function () {
                console.log("Renewing members at " + this.currentHQId);
                myModal.show({
                    template: 4
                })
            },
            showMemberInfo: function (index) {
                console.log("clicked: " + index);
                this.memberInfo = this.currentList.members[index];
                this.showMemberInfoDialog = true;
            },
            getInviteCode: function () {
                var that = this;
                $.ajax({
                    type: "POST",
                    url: "/clubs/getInviteCode",
                    data: {
                        Token: this.Token,
                        id: this.newClubId
                    },
                    success: function (response) {
                        switch (response.result) {
                            case "success":
                                myModalVue.inviteCode = response.inviteCode;
                                myModal.show({
                                    template: 5,
                                    state: ["success", ""]
                                });
                                that.step = 1;
                                break;
                            default:
                                myModal.show({
                                    template: 2,
                                    type: ["add","club"],
                                    state: ["success", "fail"],
                                    errMsg: ["", response.result]
                                });
                                break;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        myModal.show({
                            template: 2,
                            type: ["add","club"],
                            state: ["success", "fail"],
                            errMsg: ["", textStatus + ": " + jqXHR.statusText + " " + errorThrown]
                        });
                    }
                });
            },
            getHQInfo: function (id) {
                console.log("requesting: " + id);
                var that = this;
                $.ajax({
                    type: "POST",
                    url: "/clubs/getHQInfo",
                    data: {
                        Token: this.Token,
                        id: id
                    },
                    success: function (response) {
                        switch (response.result) {
                            case "success":
                                that.currentList.subHQList = response.subHQList;
                                that.currentList.members = response.members;
                                that.currentHQId = id;
                                return true;
                            default:
                                alert(response.result);
                                return false;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        alert(textStatus + ": " + jqXHR.statusText + " " + errorThrown, "");
                        return false;
                    }
                });
            },
            edit: function (id, type) {
                myModal.show({
                    template: 3,
                    param: {
                        id: id,
                        type: ["edit","hq"]
                    }
                });
            },
            del: function (id1, id2, type, name) {
                if (!confirm("确定要删除“" + name + "”吗？")) return;
                var that = this;
                $.ajax({
                    type: "POST",
                    url: type == 1 ? "/clubs/deleteHQ" : "/clubs/deleteMember",
                    data: {
                        Token: this.Token,
                        id: id1,
                        memberId: id2
                    },
                    success: function (response) {
                        switch (response.result) {
                            case "success":
                                myModal.show({
                                    template: 2,
                                    type: ["del", type==1?"hq":"member"],
                                    state: ["success"]
                                })
                                if (type == 1) {
                                    that.getMyClub();
                                    that.getHQInfo(id1);
                                } else {
                                    var newList = [];
                                    that.currentList.forEach(ele => {
                                        if (ele.id != id2) newList.push(ele)
                                    });
                                    that.currentList = newList;
                                }
                                break;
                            default:
                                myModal.show({
                                    template: 2,
                                    type: ["del", type==1?"hq":"member"],
                                    state: ["fail"],
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
            search: function (index) {
                console.log("搜索的内容：" + this.searchText);
                this.memberInfo = this.searchHistory[index]
                this.showMemberInfoDialog = true
                this.searchText = this.searchHistory[index].name
            }
        }
    });
});

function clubBGImgChanged(obj) {
    console.log(obj.files[0]);
    myVue.clubBGImg = window.URL.createObjectURL(obj.files[0]);
}

function excelFileChanged(obj) {
    console.log(obj.files[0]);
    var excelFile = window.URL.createObjectURL(obj.files[0]);
    var formFile = new FormData();
    formFile.append("Token", myVue.Token);
    formFile.append("id", myVue.newClubId);
    formFile.append("memberListFile", excelFile)
    $.ajax({
        url: "/clubs/importMember",
        method: "POST",
        processData: false,
        contentType: false,
        data: formFile,
        success: function (data) {
            if (data.result == "success") {
                myModal.show({
                    template: 2,
                    type: ["add", "club"],
                    state: ["success", "success"],
                    errMsg: ["", ""]
                })
                myVue.getMyClub();
            } else {
                myModal.show({
                    template: 2,
                    type: ["add", "club"],
                    state: ["success", "fail"],
                    errMsg: ["", data.result]
                })
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR);
            myModal.show({
                template: 2,
                type: ["add", "club"],
                state: ["success", "fail"],
                errMsg: ["", textStatus + ": " + jqXHR.statusText + " " + errorThrown]
            })
        }
    });
}