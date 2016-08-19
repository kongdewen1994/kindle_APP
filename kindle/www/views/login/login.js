angular.module('App').controller('LogCtrl', function($scope, $ionicNavBarDelegate, $http, $cordovaFileTransfer, userArray, $ionicLoading) {

	//	var picker = new mui.PopPicker();
	//  picker.setData([{value:'zz',text:'智子'}]);
	//  picker.show(function (selectItems) {
	//	   alert(selectItems[0].text);//智子
	//	   alert(selectItems[0].value);//zz
	//  })

	$scope.Username = '';

	$scope.password = '';

	//登录事件
	$scope.login = function() {

		if($scope.Username.length && $scope.password.length) {

			$ionicLoading.show({
				template: 'Loading...'
			});

			$http.get("http://api.3eat.net/kinleeb/User_login.php?code=kinlee&uname=" + $scope.Username + "&pwd=" + $scope.password)
				.success(function(response) {
					//alert(JSON.stringify(response));
					var uid = response[0]["_loginok"];
					if(uid != 0) {

						var userObj = {};
						userObj.id = uid;
						userObj.name = response[0]["_uname"];
						userObj.sex = response[0]["_sex"];
						userObj.age = response[0]["_age"];
						userObj.height = response[0]["_height"];
						userObj.litpic = 'img/user.png';

						if(response[0]["_litpic"].length > 5) {
							//alert(response[0]["_litpic"]);
							$scope.downloadPic(response[0]["_litpic"], uid, userObj);
						} else {

							userArray.users.push(userObj);
							window.localStorage.userArray = JSON.stringify(userArray.users);
							$ionicLoading.hide();

							//alert(JSON.stringify(userArray.users));
							$ionicNavBarDelegate.back();
						}

					}

				});

		} else {
			alert("请输入完整");
		}

	}

	//$ionicNavBarDelegate.back();
	//头像下载
	$scope.downloadPic = function(url, uid, userObj) {

		var urls = "http://api.3eat.net/kinleeb" + url;
		var targetPath = cordova.file.externalApplicationStorageDirectory + "userpic_" + uid + ".jpg";
		var trustHosts = true;
		var options = {};

		$cordovaFileTransfer.download(urls, targetPath, options, trustHosts)
			.then(function(result) {
				//alert("成功下载");
				//alert( JSON.stringify( result ) );

				//window.localStorage['Litpic' + uid] = result["nativeURL"];
				userObj.litpic = result["nativeURL"];
				userArray.users.push(userObj);
				window.localStorage.userArray = JSON.stringify(userArray.users);
				$ionicLoading.hide();
				//alert(JSON.stringify(userArray.users));
				$ionicNavBarDelegate.back();
			}, function(err) {
				// Error
				$ionicLoading.hide();
				alert(JSON.stringify(err));
			}, function(progress) {

			});

	}

})