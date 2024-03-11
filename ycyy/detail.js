// ==UserScript==
// @name         抢单页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://h5.ycyy.club/pages/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycyy.club
// @grant        none
// ==/UserScript==

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

  //?id=77928&coordinate=104.096838%2C30.628689&userId=33045
  const storeInfoApi = "https://h5.ycyy.club/mobile-api/app/index/getStoreInfo";
  //{"currAddress":"104.096838,30.628689","storeId":"68857","activityId":"106323","goodStore":"0","provinceName":"四川省","cityName":"成都市","districtName":"锦江区"}
  const orderApi = "https://h5.ycyy.club/mobile-api/app/index/placeAnOrder";
  const params = getUrlParams(window.location.href);
  const shopId = params.storeId;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  let storeInfo = {};

  function getStoreInfo() {
    const url = `${storeInfoApi}?id=${
      params.id
    }&coordinate=${encodeURIComponent(params.coordinate)}&userId=${
      userInfo.id
    }`;

    const headers = buildHeader();
    return ajaxRequest(url, "GET", null, headers);
  }

  const tOne = setInterval(() => {
    button.textContent = "正在加载必要脚本";
    if (scriptFlag) {
      button.textContent = "正在获取店铺信息";
      getStoreInfo().then((res) => {
        console.log(`正在获取店铺信息`);
        storeInfo = JSON.parse(res).data;
        console.log(storeInfo);
        console.log(storeInfo.id);
        button.textContent = "抢单";
      });
      clearInterval(tOne);
    }
  }, 1000);

  // 创建一个新的按钮元素
  var button = document.createElement("button");
  button.textContent = "抢单";
  button.style.position = "fixed";
  button.style.top = "10px";
  button.style.right = "10px";
  button.style.zIndex = "9999"; // 确保按钮在其他元素之上

  // 将按钮添加到页面的body中
  document.body.appendChild(button);

  // 创建模态框元素
  var modal = document.createElement("div");
  modal.id = "modal";
  modal.style.display = "none"; // 默认隐藏模态框
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#fff";
  modal.style.padding = "20px";
  modal.style.zIndex = "9999";
  modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

  // 创建模态框内容
  var modalContent = document.createElement("div");
  modalContent.innerHTML = `
        <form id="orderForm">
            <label for="shopId">店铺ID:</label>
            <input type="text" id="shopId" value="${storeInfo.id}" name="shopId" required>
            <label for="activeId">activeId:</label>
            <input type="text" id="activeId" name="activeId" required>
            <label for="orderTime">抢单时间:</label>
            <input type="text" id="orderTime" name="orderTime" required>
            <label>可抢单列表:</label>
            <div id="orderList"></div>
            <button type="button" id="submitButton">确定</button>
        </form>
    `;
  modal.appendChild(modalContent);

  // 将模态框添加到页面的body中
  document.body.appendChild(modal);

  // 创建模态框遮罩层
  var modalOverlay = document.createElement("div");
  modalOverlay.id = "modal-overlay";
  modalOverlay.style.display = "none"; // 默认隐藏遮罩层
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = "0";
  modalOverlay.style.left = "0";
  modalOverlay.style.width = "100%";
  modalOverlay.style.height = "100%";
  modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // 半透明黑色遮罩
  modalOverlay.style.zIndex = "9998"; // 确保遮罩在模态框之下

  // 将遮罩层添加到页面的body中
  document.body.appendChild(modalOverlay);

  // 当按钮被点击时显示模态框和遮罩层
  button.addEventListener("click", function () {
    modal.style.display = "block";
    modalOverlay.style.display = "block";
    modalContent.innerHTML = `
        <form id="orderForm">
            <label for="shopId">店铺ID:</label>
            <input type="text" id="shopId" value="${storeInfo.id}" name="shopId" required>
            <label for="shopName">店铺名称:</label>
            <input type="text" id="shopName" value="${storeInfo.name}" name="shopId" required>
            <label for="activeId">activeId:</label>
            <input type="text" id="activeId" name="activeId" required>
            <label for="orderTime">抢单时间:</label>
            <input type="text" id="orderTime" name="orderTime" required>
            <label>可抢单列表:</label>
            <div id="orderList"></div>
            <button type="button" id="submitButton">确定</button>
        </form>
    `;

    function platformName(n) {
      switch (n) {
        case 1:
          return "美团";
        case 2:
          return "饿了么";
        default:
          return "未知";
      }
    }

    // 假设的可抢单列表数据
    var orders = storeInfo.storeActivityListVo.map((item) => {
      return {
        id: item.id,
        name: `${item.name}(${platformName(item.platform)})`,
      };
    });

    // 动态生成可抢单列表的单选框
    var orderList = document.getElementById("orderList");
    orders.forEach(function (order) {
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "order";
      radio.value = order.id;
      radio.id = "order" + order.id;
      radio.addEventListener("click", function () {
        activeId.value = order.id;
      });

      var label = document.createElement("label");
      label.htmlFor = radio.id;
      label.textContent = order.name;

      var br = document.createElement("br");

      orderList.appendChild(radio);
      orderList.appendChild(label);
      orderList.appendChild(br);
    });

    // 获取确定按钮
    var submitButton = document.getElementById("submitButton");

    // 处理确定按钮点击事件
    submitButton.addEventListener("click", function () {
      debugger;
      // 收集表单数据
      var shopId = document.getElementById("shopId").value;
      var shopName = document.getElementById("shopName").value;
      var activeId = document.getElementById("activeId").value;
      var orderTime = document.getElementById("orderTime").value;
      var selectedOrder = document.querySelector(
        'input[name="order"]:checked'
      ).value;

      // 创建一个对象来存储表单数据
      var formData = {
        shopId: shopId,
        activeId: activeId,
        orderTime: orderTime,
        selectedOrder: selectedOrder,
        shopName: shopName,
      };

      // 获取localStorage中的orderFormData数组，如果不存在则创建一个空数组
      var existingData =
        JSON.parse(localStorage.getItem("orderFormData")) || [];

      // 检查是否存在相同的shopId
      var existingIndex = existingData.findIndex(function (data) {
        return data.shopId === shopId;
      });

      if (existingIndex !== -1) {
        // 如果存在相同的shopId，询问用户是否要删除旧的数据并添加新的
        if (
          confirm("已经存在相同shopId的数据，是否要删除旧的数据并添加新的？")
        ) {
          // 删除旧的数据
          existingData.splice(existingIndex, 1);
        } else {
          // 如果用户选择不删除，则不保存新的数据
          return;
        }
      }

      // 将新的数据添加到数组中
      existingData.push(formData);

      // 将更新后的数据数组存入localStorage
      localStorage.setItem("orderFormData", JSON.stringify(existingData));

      // 隐藏模态框和遮罩层
      hideModal();

      // 显示一个通知或者进行其他操作
      alert("表单数据已存入localStorage！");
    });
  });

  // 当遮罩层被点击时隐藏模态框和遮罩层
  modalOverlay.addEventListener("click", function () {
    hideModal();
  });

  // 隐藏模态框和遮罩层的函数
  function hideModal() {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
  }
})();
