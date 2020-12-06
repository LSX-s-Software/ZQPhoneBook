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
    myVue = new Vue({
        el: ".mainContainer",
        data: {
            show: [true, false, false],
            nodeId: 0, //当前选中的treeview节点
            currentClubIndex: 0, //当前选中的社团的序号
            currentClubId: 0, //当前选中的社团的ID
            currentHQId: 0, //当前选中的部门ID
            listEditing: false,
            currentList: {
                subHQList: [{
                    id: "0-0",
                    name: '部门 1'
                }, {
                    id: "0-1",
                    name: '部门 2'
                }, {
                    id: "0-2",
                    name: '部门 3'
                }, {
                    id: "0-3",
                    name: '部门 4'
                }],
                members: [{
                    id: "123",
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
                    marrige: false,
                    membership: "自强Studio-技术中心-产品组-部长"
                }]
            },
            myInfo: {
                id: "123",
                name: "王三三",
                nickName: "鱼子酱",
                avatarURL: "src/img/avatar.png"
            },
            myClubs: [],
            step: 1,
            clubName: "",
            clubDescription: "",
            clubBGImg: "src/img/joinClubBG.png",
            newClubId: "",
            inviteCode: "",
            showMemberInfoDialog: false,
            memberInfo: null
        },
        mounted() {
            var that = this;
            //获取个人信息
            $.ajax({
                type: "POST",
                url: "/userInfo/getMyInfo",
                data: {
                    Token: "",
                    detail: false
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
                    alert(textStatus + ": " + jqXHR.statusText + " " + errorThrown);
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
            //获取加入的社团
            $.ajax({
                type: "POST",
                url: "/userInfo/myClubs",
                data: {
                    Token: ""
                },
                success: function (response) {
                    switch (response.result) {
                        case "success":
                            that.myClubs = response.myClubs;
                            break;
                        default:
                            alert(response.result);
                            break;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR);
                    alert("获取社团信息失败");
                    that.myClubs = [{
                        index: 0,
                        id: 0,
                        name: "自强Studio",
                        bgURL: "src/img/自强.png",
                        size: 500,
                        isManager: true,
                        hqs: [{
                            id: "0-0",
                            text: '部门 1',
                            tags: [10],
                            nodes: [{
                                id: "0-0-0",
                                text: '子部门 1',
                                tags: [10]
                            },
                            {
                                id: "0-0-1",
                                text: '子部门 2',
                                tags: [20]
                            }],
                            members: []
                        },
                        {
                            id: "0-1",
                            text: '部门 2',
                            tags: [20],
                            members: [{
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
                            }]
                        }
                        ],
                        members: [{
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
                        }]
                    }];
                }
            });
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
            createClub: function () {
                var that = this;
                var formFile = new FormData();
                formFile.append("img", this.clubBGImg);
                formFile.append("Token", "");
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
                                errMsg: [data.result, ""]
                            })
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR);
                        myModal.show({
                            template: 2,
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
                    url: "/clubs/getInviteCode",
                    data: {
                        Token: "",
                        id: this.newClubId
                    },
                    success: function (response) {
                        var msg = "";
                        switch (response) {
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
                this.currentClubIndex = index
                $('#tree').treeview('selectNode', [index + 1]);
            },
            addHQ: function (id) {
                console.log("Adding HQ at " + id);
                myModal.show({
                    template: 3,
                    param: {
                        id: id,
                        type: [1, 1]
                    }
                });
            },
            renewMember: function (id) {
                alert("功能待开发");
                console.log("Renewing members at " + id)
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
                        Token: "",
                        id: this.newClubId
                    },
                    success: function (response) {
                        switch (response) {
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
                        Token: "",
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
                                alert(response);
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
                        type: type
                    }
                });
            },
            del: function (id1, id2, type, name) {
                if (!confirm("确定要删除“" + name + "”吗？")) return;
                $.ajax({
                    type: "POST",
                    url: type == 1 ? "/clubs/deleteHQ" : "/clubs/deleteMember",
                    data: {
                        Token: "",
                        id: id1,
                        memberId: id2
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
    formFile.append("Token", "");
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
                    state: ["success", "success"],
                    errMsg: ["", ""]
                })
            } else {
                myModal.show({
                    template: 2,
                    state: ["success", "fail"],
                    errMsg: ["", data.result]
                })
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR);
            myModal.show({
                template: 2,
                state: ["success", "fail"],
                errMsg: ["", textStatus + ": " + jqXHR.statusText + " " + errorThrown]
            })
        }
    });
}