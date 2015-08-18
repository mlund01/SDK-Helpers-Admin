angular.module('orderCloud.pallet', [])
        .service('PalletSvc', PalletService);


function PalletService() {
    var vm = this;
    vm.earthLastPick = "";
    vm.earthPallet = [
        "#493829",
        "#613318",
        "#855723",
        "#B99C6B",
        "#8F3B1B",
        "#D57500"
    ];
    vm.blueGreenLastPick = "";
    vm.blueGreenPallet = [
        "#BED661",
        "#89E894",
        "#78D5E3",
        "#7AF5F5",
        "#34DDDD",
        "#93E2D5"
    ];

    vm.colorPicker = function(pallet, lastPick) {
        var selection = pallet.indexOf(lastPick);
        if (selection == pallet.length) {
            selection = 0
        }
        else {
            selection = selection + 1;
        }
        return pallet[selection]


    };

    vm.pickColor = function(selection) {
        var color = "";
        switch(selection) {
            case 'earth':
                color = vm.colorPicker(vm.earthPallet, vm.earthLastPick);
                vm.EarthLastPick = color;
                return color;
                break;
            case 'blueGreen':
                color = vm.colorPicker(vm.blueGreenPallet, vm.blueGreenLastPick);
                vm.blueGreenLastPick = color;
                return color;
                break;
            default:
                break;

        }
    }

}