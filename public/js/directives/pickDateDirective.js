app.directive('datepicker', function($ionicModal) {
        return {
            restrict: 'E',
            scope: {
                value: '=',
                label: '@',
                visible: '='
            },
            template: '<label class="item item-input item-stacked-label" ng-show="!visible">' +
                '<span class="input-label">{{label}} :</span>' +
                '<input type="text" datepicker format="yyyy/mm/dd" placeholder="Select a date YYYY/MM/DD" ng-model="value" name="datepicker" ng-click="opendateModal()"  readonly>' +
                '</label>',
            link: function($scope, element, attrs) {

                setValueToInput($scope.value);
                $ionicModal.fromTemplateUrl('./templates/directives/datemodal.html',
                    function(modal) {
                        $scope.datemodal = modal;
                    }, {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }
                );
                $scope.opendateModal = function() {
                    $scope.datemodal.show();
                };

                function setValueToInput(value) {
                    element.find('input').val(value);
                    $scope.value = value;
                }
                $scope.closedateModal = function(modal) {

                    $scope.datemodal.hide();
                    $scope.datepicker = modal;
                    setValueToInput(modal);
                };

            }
        }
    })
