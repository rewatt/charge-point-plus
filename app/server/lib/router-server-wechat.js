Picker.route('/wechat/post/:_id', function(params, req, res, next) {
    res.end(params._id + ', id.');
});

var SHA1 = Npm.require('crypto-js/sha1');

var URL_PREFFIX = '/cpplus';


var WechatAPI = Npm.require('wechat-api');
var api = new WechatAPI(process.env.WECHAT_APP_ID, process.env.WECHAT_APP_SECRET);

var OAuth = require('wechat-oauth');
var oauthApi = new OAuth(process.env.WECHAT_APP_ID, process.env.WECHAT_APP_SECRET);


Picker.route(URL_PREFFIX, function(params, req, res, next) {

        res.end(process.env.APP_BASE_URL + URL_PREFFIX + "/wechat/getLoginUrl")
});


/* wechat api - verify host */
Picker.route(URL_PREFFIX + '/wechat/callback/verifyhost', function(params, req, res, next) {
    var signature = params.signature;
    var timestamp = params.timestamp;
    var nonce = params.nonce;
    var token = params.token;

    var echostr = params.echostr;
    var tmpStr = [token, timestamp, nonce].sort().join('');

    tmpStr = SHA1(tmpStr).toString();

    console.log('tmpStr1:' + tmpStr);
    console.log('signature:'+ signature);
    console.log('timestamp:'+ timestamp);
    console.log('nonce:'+ nonce);
    console.log('token:'+ token);
    console.log('tmpStr:' + tmpStr);
    console.log('echostr:'+ echostr);

    var resultStr = '';
    if(signature == tmpStr){
        resultStr = echostr;
    }
    console.log ('resultStr:' + resultStr)
    res.end(resultStr);
});


Picker.route(URL_PREFFIX + '/wechat/menuConfig', function(params, req, res, next) {
    api.getMenuConfig(function (err,result){
        console.log(JSON.stringify(result));
        res.end(JSON.stringify(result));
    });
});



/* reset wechat menu */
Picker.route(URL_PREFFIX + '/wechat/resetmenu', function(params, req, res, next) {
    var menuObj = {
        "button":[
            {
                "type":"click",
                "name":"今日歌曲11",
                "key":"V1001_TODAY_MUSIC"
            },
            {
                "name":"菜单22",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"搜索33",
                        "url":"http://www.soso.com/"
                    },
                    {
                        "type":"click",
                        "name":"赞一下我们44",
                        "key":"V1001_GOOD"
                    }]
            }]
    };
    api.createMenu(menuObj,function (err,result){
        console.log(JSON.stringify(result));
        res.end(JSON.stringify(result));
    });
});


/**
 * show login url
 */
Picker.route(URL_PREFFIX + '/wechat/getLoginUrl', function(params, req, res, next) {

    var REDIRECT_URI = process.env.APP_BASE_URL + URL_PREFFIX + '/wechat/callback/login';
// SCOPE: snsapi_base or snsapi_userinfo
    var SCOPE = 'snsapi_userinfo';
    var STATE = '';
    var url = oauthApi.getAuthorizeURL(REDIRECT_URI, STATE, SCOPE);
    console.log("url:" + url);
    res.end(url);
});
/* wechat api - verify host */
Picker.route(URL_PREFFIX + '/wechat/callback/login', function(params, req, res, next) {
    var resultStr = ''

    var code = req.query.code
    if(code){
        oauthApi.getAccessToken(code, function(err, data){
            var str = JSON.stringify(data);
            console.log("str:" + str);
            res.end(str);
        })

    } else {
        res.end('wechat oauth login error');
    }
});