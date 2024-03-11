// ==UserScript==
// @name         首页
// @namespace    http://tampermonkey.net/
// @version      2024-03-10
// @description  try to take over the world!
// @author       You
// @match        https://h5.ycyy.club/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycyy.club
// @grant        none
// ==/UserScript==

(function(s){var w,f={},o=window,l=console,m=Math,z='postMessage',x='HackTimer.js by turuslan: ',v='Initialisation failed',p=0,r='hasOwnProperty',y=[].slice,b=o.Worker;function d(){do{p=0x7FFFFFFF>p?p+1:0}while(f[r](p));return p}if(!/MSIE 10/i.test(navigator.userAgent)){try{s=o.URL.createObjectURL(new Blob(["var f={},p=postMessage,r='hasOwnProperty';onmessage=function(e){var d=e.data,i=d.i,t=d[r]('t')?d.t:0;switch(d.n){case'a':f[i]=setInterval(function(){p(i)},t);break;case'b':if(f[r](i)){clearInterval(f[i]);delete f[i]}break;case'c':f[i]=setTimeout(function(){p(i);if(f[r](i))delete f[i]},t);break;case'd':if(f[r](i)){clearTimeout(f[i]);delete f[i]}break}}"]))}catch(e){}}if(typeof(b)!=='undefined'){try{w=new b(s);o.setInterval=function(c,t){var i=d();f[i]={c:c,p:y.call(arguments,2)};w[z]({n:'a',i:i,t:t});return i};o.clearInterval=function(i){if(f[r](i))delete f[i],w[z]({n:'b',i:i})};o.setTimeout=function(c,t){var i=d();f[i]={c:c,p:y.call(arguments,2),t:!0};w[z]({n:'c',i:i,t:t});return i};o.clearTimeout=function(i){if(f[r](i))delete f[i],w[z]({n:'d',i:i})};w.onmessage=function(e){var i=e.data,c,n;if(f[r](i)){n=f[i];c=n.c;if(n[r]('t'))delete f[i]}if(typeof(c)=='string')try{c=new Function(c)}catch(k){l.log(x+'Error parsing callback code string: ',k)}if(typeof(c)=='function')c.apply(o,n.p)};w.onerror=function(e){l.log(e)};l.log(x+'Initialisation succeeded')}catch(e){l.log(x+v);l.error(e)}}else l.log(x+v+' - HTML5 Web Worker is not supported')})('HackTimerWorker.min.js');

function importScript(url) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    document.documentElement.appendChild(script);
  });
}

// 脚本URL列表
const scriptUrls = [
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/core.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/enc-base64.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/md5.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/evpkdf.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/cipher-core.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/aes.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/pad-pkcs7.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/mode-ecb.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/enc-utf8.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/enc-hex.min.js",
];

// 按顺序加载脚本
let scriptFlag = false;
scriptUrls
  .reduce((promiseChain, url) => {
    return promiseChain.then(() => {
      return importScript(url)
        .then(() => {
          console.log(`Script loaded: ${url}`);
        })
        .catch((error) => {
          console.error(`Error loading script: ${url}`, error);
        });
    });
  }, Promise.resolve())
  .then(() => {
    console.log("All scripts have loaded.");
    scriptFlag = true;
  })
  .catch((error) => {
    console.error("An error occurred while loading scripts:", error);
  });

(async function () {
  "use strict";

  function getUrlParams(url) {
    // 创建一个新的URL对象
    let urlObj = new URL(url);

    // 获取查询参数
    let params = new URLSearchParams(urlObj.search);

    // 创建一个对象来存储参数
    let result = {};

    // 遍历查询参数并将其添加到结果对象中
    for (let [key, value] of params) {
      result[key] = value;
    }

    return result;
  }

  function generateRandomString(length) {
    const charset =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }

    return result;
  }

  function getSign() {
    const test =
      generateRandomString(21) + "," + new Date().getTime() + ",ycyy";
    const r = CryptoJS.enc.Utf8.parse("ycyy_secret_key_");
    const s = CryptoJS.enc.Utf8.parse("_ycyy_secret_iv_");
    const n = CryptoJS.enc.Utf8.parse(test);
    const t = CryptoJS.AES.encrypt(n, r, {
      iv: s,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const Sign = CryptoJS.enc.Base64.stringify(t.ciphertext);
    console.log(Sign);
    return Sign;
  }

  function getToken() {
    return window.localStorage.getItem("token");
  }

  function buildHeader() {
    return {
      "content-type": "application/json",
      Authorization: getToken(),
      Sign: getSign(),
      registerId: "",
      terminal: "H5",
      version: "H5",
    };
  }

  function ajaxRequest(url, method, data, headers) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);

      if (headers) {
        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value);
        }
      }

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.statusText);
        }
      };

      xhr.onerror = function () {
        reject(xhr.statusText);
      };

      xhr.send(data);
    });
  }

  const storeInfoApi = "https://h5.ycyy.club/mobile-api/app/index/getStoreInfo";
  const orderApi = "https://h5.ycyy.club/mobile-api/app/index/placeAnOrder";

  setInterval(() => {
    var orderFormData = JSON.parse(localStorage.getItem("orderFormData")) || [];
    var currentTime = new Date().toTimeString().substring(0, 8);
    console.log(`定时器执行中...${currentTime}`);
    orderFormData.forEach(function (item) {
      console.log(item.orderTime + ":00", currentTime);
      if (item.orderTime + ":00" === currentTime) {
        console.log("进入了");
        let data = {
          currAddress: "104.096838%2C30.628689",
          storeId: item.shopId,
          activityId: item.activeId,
          goodStore: "0",
          provinceName: "四川省",
          cityName: "成都市",
          districtName: "锦江区",
        };

        let url = orderApi;
        Object.keys(data).forEach((key) => {
          if (url == orderApi) {
            url += `?${key}=${data[key]}`;
          } else {
            url += `&${key}=${data[key]}`;
          }
        });

        ajaxRequest(url, "GET", {}, buildHeader()).then((res) => {
          let s = res;
          if (typeof s == "string") {
            s = JSON.parse(s);
          }

          alert(s.msg);
        });
      }
    });
    console.log("定时器执行完毕");
  }, 500);

  // 创建按钮元素
  var button = document.createElement("button");
  button.textContent = "查看";
  button.style.position = "fixed";
  button.style.top = "10px";
  button.style.right = "10px";
  button.style.zIndex = "9999";

  // 创建弹窗元素
  var modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.display = "none";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  // 创建弹窗内容元素
  var modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "5px";
  modalContent.style.overflowY = "auto"; // 添加滚动条
  modalContent.style.maxHeight = "80%"; // 设置最大高度
  modalContent.style.maxWidth = "80%"; // 设置最大宽度

  // 将弹窗内容添加到弹窗中
  modal.appendChild(modalContent);

  // 添加按钮点击事件
  button.addEventListener("click", function () {
    // 从localStorage中获取数据
    var orderFormData = JSON.parse(localStorage.getItem("orderFormData")) || [];

    // 清空弹窗内容
    modalContent.innerHTML = "";

    // 遍历数据并创建列表项
    orderFormData.forEach(function (item, index) {
      var listItem = document.createElement("div");
      listItem.style.borderBottom = "1px solid #ccc";
      listItem.style.padding = "10px 0";
      listItem.innerHTML = `
                <p><strong>店铺名称:</strong> ${item.shopName}</p>
                <p><strong>订单时间:</strong> ${item.orderTime}</p>
                <p><strong>活动ID:</strong> ${item.activeId}</p>
                <button class="delete-button" data-index="${index}">删除</button>
            `;
      modalContent.appendChild(listItem);
    });

    // 显示弹窗
    modal.style.display = "flex";
  });

  // 添加遮罩层点击事件
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // 添加删除按钮点击事件
  modalContent.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-button")) {
      var index = e.target.dataset.index;
      var orderFormData =
        JSON.parse(localStorage.getItem("orderFormData")) || [];

      // 从localStorage中删除对应的项
      orderFormData.splice(index, 1);
      localStorage.setItem("orderFormData", JSON.stringify(orderFormData));

      // 从列表中删除对应的项
      e.target.parentElement.remove();
    }
  });

  // 将按钮添加到页面中
  document.body.appendChild(button);
  document.body.appendChild(modal);
})();
