/**
 * WiStormAPI.js的单元测试文件
 */
include("wslib/api/WUserApi.js");
window.onload=function(){
	asyncTest("登录测试",3,
		function(){
		   	W.userApi.login(
				function(data){
					deepEqual(data,{"cust_id": 1,"cust_name": data.cust_name,"cust_type": 2,"status_code": 0});
				},
				{
					account: "13316891158",
				    password: "123456"
				}
			);
		   	W.userApi.login(
				function(data){
					deepEqual(data,{"msg":___.server_error.psw_error,"status_code": 2});
				},
				{
					account: "13316891158",
				    password: "1234567"
				}
			);
			W.userApi.login(
				function(data){
					deepEqual(data,{"msg":___.server_error.no_account,"status_code": 1});
			        start();
				},
				{
					account: "133168911587",
				    password: "123456"
				}
			);
		}
	);
	
	asyncTest("获取用户车辆列表测试",1,
		function(){
		   	W.userApi.getCarList(
				function(data){
					deepEqual(data.length,5);
					start();
				}
			);
		}
	);
	
	asyncTest("获取用户下属车辆列表测试",1,
		function(){
		   	W.userApi.getCustomersList(
				function(data){
					deepEqual(data,100);
					start();
				},
				{
					cust_id:"177",
					tree_path:",1,177,",
					auth_code:"127a154df2d7850c4232542b4faa2c3d"
				}
			);
		}
	);
}

