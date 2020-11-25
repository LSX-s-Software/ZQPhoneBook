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
            nodeId: 0,
            currentId: 0,
            currentClubId: 0,
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
            myClubs: [{
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
            }],
            step: 1,
            clubName: "",
            clubDescription: "",
            clubBGImg: "src/img/joinClubBG.png",
            inviteCode: "",
            showMemberInfoDialog: false,
            memberInfo: null
        },
        mounted() {
            treeData[0].tags = [this.myClubs.length];
            var i = 0;
            this.myClubs.forEach(club => {
                addIcon(club.hqs);
                treeData[0].nodes.push({
                    id: i++,
                    text: club.name,
                    tags: [club.size],
                    icon: "myIcon icon-club",
                    nodes: club.hqs
                });
            });
            generateTree(treeData)
        },
        watch: {
            currentClubId: function (val) {
                console.log("Club Changed To " + val)
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
                            errMsg: [textStatus + ":" + jqXHR.statusText + " " + errorThrown, ""]
                        })
                    }
                });
            },
            joinClub: function () {
                myModal.show({
                    template: 1,
                    state: ["success", ""],
                    errMsg: ["", ""],
                    clubName: "自强Studio"
                })
            },
            cardClicked: function (index) {
                this.nodeId = index
                $('#tree').treeview('selectNode', [index + 1]);
            },
            addHQ: function (id) {
                console.log("Adding HQ at " + id)
                myModal.show({
                    template: 3
                })
            },
            renewMember: function (id) {
                console.log("Renewing members at " + id)
                myModal.show({
                    template: 4
                })
            },
            showMemberInfo: function (index) {
                console.log("clicked:" + index);
                this.memberInfo = this.currentList.members[index];
                this.showMemberInfoDialog = true;
            }
        }
    });
});

function generateTree(data) {
    $('#tree').treeview({
        data: data,
        expandIcon: 'glyphicon myIcon icon-arrow',
        collapseIcon: 'glyphicon myIcon icon-arrow-down',
        showBorder: false,
        showTags: true,
        emptyIcon: "",
        color: "#000",
        selectedBackColor: "var(--themeColor)",
        backColor: "transparent",
        onhoverColor: "#4fce9fab",
        onNodeSelected: function (event, data) {
            console.log(data)
            myVue.nodeId = data.nodeId
            myVue.currentId = data.id
            $('#tree').treeview('expandNode', [data.nodeId, { levels: 1, silent: true }]);
            switch (data.icon) {
                case "myIcon icon-myClub":
                    myVue.show = [true, false, false]
                    break;
                case "myIcon icon-createClub":
                    myVue.show = [false, true, false]
                    $('#tree').treeview('collapseAll', { silent: true });
                    break;
                case "myIcon icon-joinClub":
                    myVue.show = [false, false, true]
                    $('#tree').treeview('collapseAll', { silent: true });
                    break;
                case "myIcon icon-club":
                    myVue.currentClubId = data.id
                default:
                    break;
            }
        },
        onNodeExpanded: function (event, node) {
            console.log(node)
            $('#tree').treeview('selectNode', [node.nodeId]);
        },
        onNodeCollapsed: function (event, node) {
            console.log(node)
            $('#tree').treeview('selectNode', [node.nodeId]);
        },
        onNodeUnselected: function (event, node) {
            console.log(node);
            // $('#tree').treeview('collapseNode', [ node.nodeId, { silent: true } ]);
        },
    });
}

function addIcon(target) {
    target.forEach(tar => {
        tar.icon = "myIcon icon-HQ"
        if (tar.nodes != undefined && tar.nodes.length != 0) {
            addIcon(tar.nodes)
        }
    })
}

function clubBGImgChanged(obj) {
    console.log(obj.files[0]);
    myVue.clubBGImg = window.URL.createObjectURL(obj.files[0]);
}