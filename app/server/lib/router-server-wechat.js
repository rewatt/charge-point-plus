Picker.route('/wechat/post/:_id', function(params, req, res, next) {
    res.end(params._id + ', id.');
});

var SHA1 = Npm.require('crypto-js/sha1');

var URL_PREFFIX = '/cpplus';

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


Picker.route(URL_PREFFIX + '/wechat/params', function(params, req, res, next) {
    res.end(process.env.WECHAT_APP_ID);
});