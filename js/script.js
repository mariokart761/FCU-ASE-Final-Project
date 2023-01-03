// js
// querySelector setting
function $$(element) {
  return document.querySelector(element);
}
function $$all(element) {
  return document.querySelectorAll(element);
}

// animate setting
const animateCSS = (element, animation, prefix = "animate__") =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

//page control
function pageOutThenPageIn(pageOut, pageIn, doSomething) {
  animateCSS(pageOut, "bounceOutLeft").then((message) => {
    $$(pageOut).classList.add("d-none");
    doSomething;
    $$(pageIn).classList.remove("d-none");
    animateCSS(pageIn, "bounceInRight").then((message) => {});
  });
}
function pageOutThenPageInWithLoad(pageOut, pageIn, somethingInLoading) {
  pageOutThenPageIn(pageOut, ".loading-page");
  somethingInLoading;
  // 過場時間
  setTimeout(() => {
    pageOutThenPageIn(".loading-page", pageIn);
  }, "5000");
}
function startTrans() {
  if (checkTransSettingInfo() == "deny") {
    return;
  }
  pageOutThenPageInWithLoad(
    ".trans-setting-page",
    ".trans-result-page",
    fileToBackend()
  );
}
//較驗翻譯功能輸入是否合理，若合理則將資料發給後端
function checkTransSettingInfo() {
  if (
    $$(".preview-trans-img").currentSrc == ""
    // $("#sourceLang").val() == $("#targetLang").val() //較驗輸入是否能相同
  ) {
    showTransSettingError();
    return "deny";
  }
}
//文字翻譯資料錯誤處理
function showTransSettingError() {
  alert("輸入錯誤! 請檢查輸入是否完整，且來源語言不可與目標語言相同。");
  console.log("[Error]資料輸入需要修正，由前端擋下");
}

function pageOutThenPageInReverse(pageOut, pageIn, doSomething) {
  animateCSS(pageOut, "bounceOutRight").then((message) => {
    $$(pageOut).classList.add("d-none");
    doSomething;
    $$(pageIn).classList.remove("d-none");
    animateCSS(pageIn, "bounceInLeft").then((message) => {});
  });
}
function backToHome(pageOut) {
  pageOutThenPageInReverse(pageOut, ".loading-page");
  //預設2秒過場
  setTimeout(() => {
    pageOutThenPageInReverse(".loading-page", ".home-page");
    //清空翻譯結果畫面資料
    $$("#resultImage").src = "";
    $$('#transResult').innerText = "";
  }, "2000");
}
function changeOriginLang(thisObj) {
  // $$(".origin-lang-toggle").innerText = thisObj.innerText;
}
function changeTargetLang(thisObj) {
  // $$(".target-lang-toggle").innerText = thisObj.innerText;
}
function resetData() {
  //清除(初始化)已輸入的資料
  $$(".preview-trans-img").src = "";
  $$(".preview-poker-img").src = "";
}

function changePlayStyle(thisObj) {
  // $$(".poker-play-style-toggle").innerText = thisObj.innerText;
}
function changePokerClass(thisObj) {
  // $$(".poker-class-toggle").innerText = thisObj.innerText;
}

//較驗樸克輸入資料
function checkPokerSettingInfo() {
  if ($$(".preview-poker-img").currentSrc == "") {
    showPokerSettingError();
    return "deny";
  }
}
function showPokerSettingError() {
  alert("輸入錯誤! 請檢查輸入是否完整。");
  console.log("[Error]資料輸入需要修正，由前端擋下");
}

function startRecommend() {
  if (checkPokerSettingInfo() == "deny") {
    return;
  }
  pageOutThenPageInWithLoad(
    ".poker-setting-page",
    ".poker-result-page",
    fileToBackend()
  );
}
