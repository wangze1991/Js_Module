/**
 * @author wangze
 * @date 2018-05-03 14:48.
 * @email 595702583@qq.com
 **/

/**
* 取得url参数
*/
function getUrlParam( name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
    if (r != null) return unescape(r[2]); return null; // 返回参数值
}
function GetUrlParam(url, paraName) {
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
                return arr[1];
            }
        }
        return "";
    }
    else {
        return "";
    }
}

var url="http://www.chinapatentproduct.com/api/login/wxlogin?openId=oeJbl5QQSy_gq-vuRwxrh-kx2_O0&encryptedData=i4X2qoe5eowQMhNitQjCJ8NP+jtLPSX0jAgO5yExho/kn+dWun8FkHDDwldAnuXljYCCKzatfF3mYuxlfk1vdbpDmgrHDHg1hGQzm4jG4aZ4ueBeXWKiw9+s31y8k3hxS2Td9aqUUdHYPgeMZ0Y6OhSCf3kuxQSRBjeJhXLrqKUv1VAv+lrbyobdOXE7pPgKp0ODLPMHJlMxxVsLEhdF7w==&sessionKey=uvTG3Him51CStIZYX+0EQg==&iv=T5VL3nwnO+zxPXXNk2aDDw==";



console.log('openId:'+GetUrlParam(url,'openId'));
console.log('encryptedData:'+GetUrlParam(url,'encryptedData'));
console.log('sessionKey:'+GetUrlParam(url,'sessionKey'));
console.log('iv :'+GetUrlParam(url,'iv'));