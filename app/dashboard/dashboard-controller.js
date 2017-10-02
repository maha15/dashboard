nuageApp.controller('dashboardCtrl', ['$scope', '$state', '$q', 'MainDataService', 'FormatService', 
    function ($scope, $state, $q, MainDataService, FormatService) {
        $scope.filteredOutlets = [];

        $scope.clickftn = function () {
            $state.go('company');
        };

        $scope.loadCompanies = function () {
            var defer = $q.defer();
            // TODO: (WB: MAHA) Get those companies which the logged in person is authorized to see

            MainDataService.getCompanies().then(function (companies) {
                $scope.companies = companies;
                defer.resolve();
            }, function () {
                console.error('could not load companies');
                defer.reject();
            });
            return defer.promise;
        }
        $scope.getSelectedCompanies = function () {
            var selectedCompanies = [];
            if (!($scope.filteredCompanies && $scope.filteredCompanies.length)) {
                // TODO: (WB: MAHA) set filtered companies to those that the logged in person is registered with 
                $scope.filteredCompanies = [$scope.companies[3]];
                $scope.companies[3].ticked = true;
            }

            selectedCompanies = $scope.filteredCompanies.map(function (c) { return c.CompanyId; });

            return selectedCompanies;
        }
        $scope.init = function () {
            $scope.loadCompanies().then(function () {
                $scope.getSelectedCompanies();
            });
        }
        $scope.revenueClicked = function () {
            $scope.showRevenueSection = !$scope.showRevenueSection;
        };


    }]);
nuageApp.controller('newProductCtrl', ['$scope', 'InventoryDataService', '$uibModalInstance', 'components', '$q', 'MainDataService',
    function ($scope, InventoryDataService, $uibModalInstance, components, $q, MainDataService) {
        MainDataService.getCompanies().then(function (companies) {
            $scope.companies = companies;
        }, function () { });

        $scope.product = {
            SKU: '',
            CompanyId: 0,
            ProductId: 0,
            Name: '',
            LeadTime: '',
            ProductCategoryId: 0,
            Region: '',
            SalesPrice: 0,
            Size: '',
            Cost: 0,
            Components: [
            ]
        };
        $scope.components = [{ Name: 'New Component' }];
        $scope.components = $scope.components.concat(components);

        $scope.newCompCheck = function (val) {
            if (val == 'New Component')
                $scope.addNewProductComponent();
        }
        $scope.selectedComponent = {};
        $scope.productComponents = [];
        $scope.addExistingProductComponent = function () {
            $scope.productComponents.push({
                component: '', required: '', units: ''
            });
        };
        $scope.addNewProductComponent = function () {
            InventoryDataService.addComponent().then(function (newComponent) {
                $scope.components.push(newComponent);
            });
        };
        $scope.add = function () {
            $scope.product.CompanyId = $scope.product.CompanyId.CompanyId;
            if ($scope.productComponents.length) {
                angular.forEach($scope.productComponents, function (c) {
                    if (!c.component)
                        return;
                    $scope.product.Components.push(c.component);
                });
                $uibModalInstance.close($scope.product);
            }
            else
                $uibModalInstance.close($scope.product);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    }]);
nuageApp.controller('newComponentCtrl', ['$scope', '$uibModalInstance', 'InventoryDataService', 'MainDataService',
 function ($scope, $uibModalInstance, IDS, MainDataService) {

     MainDataService.getCompanies().then(function (companies) {
         IDS.getSuppliers(companies).then(function (suppliers) {
             $scope.suppliers = suppliers;
         }, function () { });
         $scope.companies = companies;
     }, function () { });

     $scope.component = {
         "Id": 0,
         "CompanyId": 0,
         "Code": "",
         "Name": "",
         "MOQ": 0,
         "Unit": "",
         "Cost": 0,
         "Supplier": "",
         "DeliveryTime": 0
     };
     $scope.add = function () {
         $scope.component.Supplier = $scope.component.Supplier.Name;
         $scope.component.CompanyId = $scope.component.CompanyId.CompanyId;
         $uibModalInstance.close($scope.component);
     };
     $scope.cancel = function () {
         $uibModalInstance.dismiss();
     };

 }])

nuageApp.controller('cashFlowManagementCtrl', ['$scope', '$uibModalInstance', '$filter', '$q', 'CashFlowDataService', 'amountPayActions', 'amountRecvActions', 'statusOptions', 'tableData', function ($scope, $uibModalInstance, $filter, $q, CashFlowDataService, amountPayActions, amountRecvActions, statusOptions, tableData) {

    var data = angular.copy(tableData);
    statusOptions = statusOptions.map(function (val) { return { id: val }; });
    $scope.views = [{ name: 'Amount Recievable (AR)', value: 'AR' }, { name: 'Amount Payable (AP)', value: 'AP' }];
    var r = 0, c = 0;
    $scope.gridOptions = {
        enableSorting: true,
        paginationPageSize: 9,
        columnDefs: [
          { name: 'Date (init)', field: 'InitDate', type: 'date', cellFilter: 'date:"yyyy-MM-dd"', enableCellEdit: false, cellClass: 'disabledCell', width: 85 },
          { name: 'Name', field: 'Name', enableCellEdit: false, cellClass: 'disabledCell' },
          { name: 'Due Date', type: 'date', field: 'DueDate', cellFilter: 'date:"yyyy-MM-dd"', enableCellEdit: false, cellClass: 'disabledCell', width: 85 },
          {
              name: 'Amount Due ($)', field: 'Amount', enableCellEdit: false, width: 120, cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                  r = row;
                  c = col;
                  if (grid.getCellValue(row, col) > 0)
                      return 'disabledCellAR';
                  else if (grid.getCellValue(row, col) < 0)
                      return 'disabledCellAP';
              }
          },
          {
              name: 'Pay ($)', field: 'pay', type: 'number', enableCellEdit: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                  if (grid.getCellValue(r, c) > 0)
                      return false;
                  else if (grid.getCellValue(r, c) < 0)
                      return true;
              },
              cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                  if (grid.getCellValue(r, c) > 0)
                      return 'disabledCell';
                  else if (grid.getCellValue(r, c) < 0)
                      return 'editableCell';
              }, width: 75
          },
          {
              name: 'Action', displayName: 'Action', editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'id', cellClass: 'editableCell',
              editDropdownRowEntityOptionsArrayPath: 'actionOptions'
          },
          {
              name: 'Status', displayName: 'Status', editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'id', cellClass: 'editableCell',
              editDropdownOptionsArray: statusOptions
              //[
              //  { id: 'Commited' },
              //  { id: 'In Progress' },
              //  { id: 'Pending' },
              //  { id: 'On Hold' },
              //  { id: 'Follow Up' }
              //]
          },
          { name: 'Date', field: 'Date', type: 'date', enableCellEdit: true, cellFilter: 'date:"yyyy-MM-dd"', cellClass: 'editableCell', width: 85 },
          { name: 'Notes', field: 'Notes', enableCellEdit: true, cellClass: 'editableCell' },
        ],
        data: data,

    };
    $scope.APActions = amountPayActions.map(function (val) { return { id: val }; })
    //[
    //    { id: 'Pay Now' },
    //    { id: 'Pay by Cheque' },
    //    { id: 'Pay by Bank Transfer' },
    //    { id: 'Hold' },
    //    { id: 'Enquiry' },
    //    { id: 'Pending' }
    //];

    $scope.ARActions = amountRecvActions.map(function (val) { return { id: val }; });
    //[{ id: 'Follow Up' }];

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.core.on.renderingComplete($scope, function (rowEntity, colDef, newValue, oldValue) {
            var rows = rowEntity.grid.appScope.gridOptions.data.length;
            var data = rowEntity.grid.appScope.gridOptions.data;
            for (var i = 0; i < rows; i++) {
                if (data[i]['IsPayable'] && data[i]['Amount'] < 0)
                    rowEntity.grid.appScope.gridOptions.data[i].actionOptions = $scope.APActions;
                else if (data[i]['IsReceivable'] && data[i]['Amount'] > 0)
                    rowEntity.grid.appScope.gridOptions.data[i].actionOptions = $scope.ARActions;
                //else
                //    rowEntity.grid.appScope.gridOptions.data[i].actionOptions = [];
            }
        });
        //gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };
    //$scope.saveRow = function (rowEntity) {
    //    //create a fake promise - normally you'd use the promise returned by $http or $resource
    //    var promise = $q.defer();
    //    //rowEntity['update'] = true;
    //    //$scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);

    //    return promise.resolve();
    //};
    var getData = function (filter) {
        if (filter) {

            var filteredData = [];
            for (var i = 0; i < data.length; i++) {
                if (filter == 'AR' && parseInt(data[i].Amount) > 0)
                    filteredData.push(data[i]);
                else if (filter == 'AP' && parseInt(data[i].Amount) < 0)
                    filteredData.push(data[i]);
                //else if (filter == 'Other' && parseInt(data[i].Amount) == 0)
                //    filteredData.push(data[i]);

            }
            $scope.gridOptions.data = filteredData;
        }
        else
            $scope.gridOptions.data = data;

    }
    $scope.$watch('filteredView', function () {
        if ($scope.filteredView && $scope.filteredView.length)
            getData($scope.filteredView[0].value);
        else
            getData();
    }, true);

    $scope.submit = function () {
        var editedRows = $scope.gridApi.rowEdit.getDirtyRows();
        var promises = [];
        var defer = $q.defer();

        editedRows.forEach(function (obj) {
            var data = obj.entity;
            if (data.IsPayable && data.pay) {
                data.Amount = Math.abs(data.Amount + data.pay);
                data.pay = null;
            }
            promises.push(CashFlowDataService.updateCashFlowData(data));
        });
        $q.all(promises).then(function () {
            console.log("Rows saved");
            return defer.resolve();
        }, function () {
            return defer.reject();
        });

        $uibModalInstance.close($scope.gridOptions.data);
        return defer.promise;
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

}])
nuageApp.controller('uploadDocsCtrl', ['$scope', '$uibModalInstance', 'Upload', '$rootScope', '$timeout',
    function ($scope, $uibModalInstance, Upload, $rootScope, $timeout) {
        $scope.selected = { file: '' };
        $scope.uploadFiles = function (files) {
            $scope.files = files;

        };
        $scope.add = function () {
            if ($scope.files && $scope.files.length) {
                Upload.upload({
                    url: $rootScope.baseURL + 'FileUpload',
                    data: {
                        files: $scope.files
                    }
                }).then(function (response) {
                    $timeout(function () {
                        $scope.result = response.data;
                        $uibModalInstance.close();
                    });
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                        $scope.cancel();
                    }
                }, function (evt) {
                    $scope.progress =
                        Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    }])


nuageApp.controller('eventCtrl', ['$scope', '$uibModalInstance', '$rootScope', '$timeout', 'EventCalendarService',
    function ($scope, $uibModalInstance, $rootScope, $timeout, EventCalendarService) {
     
        $scope.add = function () {
            //EventCalendarService.insertCompanyEvent
          

           // EventCalendarService.setName = name;
           $rootScope.$broadcast('eventName', { message: $scope.name });
           console.log("broadcasted " + $scope.name);
            $uibModalInstance.dismiss();

        };
        $scope.cancel = function () {
          $uibModalInstance.dismiss();
        };

    }])