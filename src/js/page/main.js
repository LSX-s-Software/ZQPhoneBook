var defaultData = [
    {
        text: '我的社团',
        tags: ['4'],
        icon: "myIcon icon-myClub",
        state: {
            selected: true
        },
        nodes: [
            {
                text: 'Child 1',
                tags: ['2'],
                icon: "myIcon icon-club",
                nodes: [
                    {
                        text: 'Grandchild 1',
                        tags: ['0']
                    },
                    {
                        text: 'Grandchild 2',
                        tags: ['0']
                    }
                ]
            },
            {
                text: 'Child 2',
                icon: "myIcon icon-club",
                tags: ['0']
            }
        ]
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
$(document).ready(function () {
    var myVue = new Vue({
        el: ".mainViewContainer",
        data: {
            show: [true, false, false],
            step: 1,
            clubName: "",
            clubDescription: "",
            inviteCode: ""
        },
        //----------按钮点击事件-------------
        methods: {
            createClub: function () { 
                this.step = 2;
            },
            joinClub: function () {
                myModal.show({
                    template: 1,
                    state: ["success", ""],
                    errMsg: ["", ""],
                    clubName: "自强Studio"
                })
            }
        }
    });
    $('#tree').treeview({
        data: defaultData,
        expandIcon: 'glyphicon myIcon icon-arrow',
        collapseIcon: 'glyphicon myIcon icon-arrow-down',
        showBorder: false,
        emptyIcon: "",
        color: "#000",
        selectedBackColor: "var(--themeColor)",
        backColor: "transparent",
        onhoverColor: "#4fce9fab",
        onNodeSelected: function (event, data) {
            console.log(data)
            switch (data.icon) {
                case "myIcon icon-myClub":
                    myVue.show = [true, false, false]
                    break;
                case "myIcon icon-createClub":
                    myVue.show = [false, true, false]
                    break;
                case "myIcon icon-joinClub":
                    myVue.show = [false, false, true]
                    break;
                default:
                    break;
            }
        }
    });
});