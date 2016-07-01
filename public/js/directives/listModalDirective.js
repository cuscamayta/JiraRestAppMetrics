app.directive('listModal', function ($ionicModal) {
    return {
        restrict: 'E',
        scope: {
            listData: '=',
            placeholder: '@',
            label: '@',
            itemSelected: '=',
            actionLoad: '&?',
            keyValue: '@',
            nameValue: '@',
            valuetext: '='
        },
        template: '<label class="item item-input item-stacked-label" >' +
        '<span class="input-label">{{label}} :</span>' +
        '<input type="text"   placeholder="{{placeholder}}" ng-model="valuetext" name="selectModal" ng-click="opendateModal()"  readonly>' +
        '</label>',
        link: function ($scope, element, attrs) {

            //  $scope.$watch('listData', function (newValue, oldValue) {
            // if (newValue == null) return;
            //  $scope.listData = newValue;
            //  });

            setValueToInput($scope.itemSelected);

            $ionicModal.fromTemplateUrl('./templates/directives/listmodal.html',
                function (modal) {
                    $scope.listModal = modal;
                }, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }
            );
            $scope.opendateModal = function () {
                $scope.listModal.show();
            };

            function setValueToInput(value) {
                $scope.keyValue = $scope.keyValue || "id";
                $scope.nameValue = $scope.nameValue || "name";
                // element.find('input').val(value[$scope.nameValue]);
                //  $scope.valuetext = value[$scope.nameValue];
                $scope.itemSelected = value;

            }
            $scope.hideModal = function () {
                $scope.listModal.hide();

            };
            $scope.setItemSelected = function (item) {

                // setValueToInput(itemSelected);   
                // $scope.itemSelected = {$scope.keyValue : item[$scope.keyValue], name: item.name };
                $scope.listModal.hide();
                if ($scope.actionLoad) $scope.actionLoad({ item: item });
            }

            $scope.acceptItem = function () {
                $scope.listModal.hide();
            }

        }
    }
})
