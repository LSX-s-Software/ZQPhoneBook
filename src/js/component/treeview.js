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
            console.log(data);
            $('#tree').treeview('expandNode', [data.nodeId, { levels: 1, silent: true }]);
            switch (data.icon) {
                case "myIcon icon-myClub":
                    myVue.show = [true, false, false];
                    break;
                case "myIcon icon-createClub":
                    myVue.show = [false, true, false];
                    $('#tree').treeview('collapseAll', { silent: true });
                    break;
                case "myIcon icon-joinClub":
                    myVue.show = [false, false, true];
                    $('#tree').treeview('collapseAll', { silent: true });
                    break;
                case "myIcon icon-club":
                    myVue.currentClubId = data.id;
                    break;
                case "myIcon icon-HQ":
                    if (!myVue.getHQInfo(data.id)) {
                        $('#tree').treeview('selectNode', [myVue.nodeId]);
                        return
                    }
                    break;
                default:
                    break;
            }
            myVue.nodeId = data.nodeId;
        },
        onNodeExpanded: function (event, node) {
            console.log(node);
            $('#tree').treeview('selectNode', [node.nodeId]);
        },
        onNodeCollapsed: function (event, node) {
            console.log(node);
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
    });
}