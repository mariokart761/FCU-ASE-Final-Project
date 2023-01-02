// querySelector setting
function $$(element) {
  return document.querySelector(element);
}
function $$all(element) {
  return document.querySelectorAll(element);
}

// animate setting
const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
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
  //先設定5秒過場
  setTimeout(() => {
    console.log("Delayed for 5 second.");
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
    // $$(".origin-lang-toggle").innerText == "來源語言" ||
    // $$(".target-lang-toggle").innerText == "目標語言" ||
    $$(".preview-trans-img").currentSrc == "" ||
    $("#sourceLang").val() == $("#targetLang").val()
    // $$(".origin-lang-toggle").innerText == $$(".target-lang-toggle").innerText
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
  //設定2秒過場
  setTimeout(() => {
    console.log("Delayed for 2 second.");
    pageOutThenPageInReverse(".loading-page", ".home-page");
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
  // $$(".origin-lang-toggle").innerText = "來源語言";
  // $$(".target-lang-toggle").innerText = "目標語言";
  // $$(".poker-class-toggle").innerText = "選擇類型";
  // $$(".poker-play-style-toggle").innerText = "選擇玩法";
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
  if (
    // $$(".poker-class-toggle").innerText == "選擇類型" ||
    // $$(".poker-play-style-toggle").innerText == "選擇玩法" ||
    $$(".preview-poker-img").currentSrc == ""
  ) {
    showPokerSettingError();
    return;
  }
  pageOutThenPageInWithLoad(
    ".poker-setting-page",
    ".poker-result-page",
    waitTransResult()
  );
}
function showPokerSettingError() {
  alert("輸入錯誤! 請檢查輸入是否完整。");
  console.log("[Error]資料輸入需要修正，由前端擋下");
}
