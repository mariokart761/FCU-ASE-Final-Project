import easyocr
import json
# pip install googletrans==3.1.0a0
# 安裝3.1.0a0版本的googletrans，用其他版本可能會出錯
import googletrans
from PIL import Image, ImageDraw, ImageFont


# ----------OCR----------
def ocr(lang, imgPath):
    with open('./json/ocrLang.json') as f:
        ocrLang = json.load(f)
    # easyocr的lang code #
    # {   "chinese(tra)":"ch_tra",
    #     "chinese(sim)":"ch_sim",
    #     "english":"en",
    #     "japanese":"ja",
    #     "korean":"ko"
    # }
    ocrReader = easyocr.Reader(
        [ocrLang[lang]], gpu=False, detect_network='craft')
    ocrResult = ocrReader.readtext(imgPath)
    filteredOcrResult = []
    for i in ocrResult:
        if (i[2] > 0.4): #最低預測機率
            filteredOcrResult.append(i)
    # if (len(filteredOcrResult) == 0):
    #     print("[INFO]"+"哎呀!好像找不到圖片上的文字呢!")
    #     print("[INFO]"+"請確認您的圖片與語言的選擇是否正確。")
    return filteredOcrResult


# ----------翻譯----------
def trans(lang, filteredOcrResult):
    translator = googletrans.Translator()
    googleTransResult = [""]*len(filteredOcrResult)  # 使翻譯結果與OCR輸出為同樣的資料型態，方便處理

    with open('./json/transLang.json') as f:
        transLang = json.load(f)

    # src與dest的lang code
    # {
    #     "chinese(tra)":"zh-tw",
    #     "chinese(sim)":"zh-cn",
    #     "english":"en",
    #     "japanese":"ja",
    #     "korean":"ko"
    # }

    try:
        for i in range(len(filteredOcrResult)):
            googleTransResult[i] = translator.translate(
                filteredOcrResult[i][1], dest=transLang[lang]).text
    except Exception as e:
        print("[INFO]" + str(e))
    return googleTransResult


# ----------繪製圖像----------
# 建立要框選的座標軸的list
def drawImg(filteredOcrResult, imgPath):
    drawCoord = []
    try:
        for i in range(len(filteredOcrResult)):
            # [(x0, y0), (x1, y1)] or [x0, y0, x1, y1]
            tempCoord = [filteredOcrResult[i][0][0][0],
                         filteredOcrResult[i][0][0][1],
                         filteredOcrResult[i][0][2][0],
                         filteredOcrResult[i][0][2][1]]
            if (i == 0):
                drawCoord = [tempCoord]
            else:
                drawCoord.append(tempCoord)
    except Exception as e:
        print("[INFO]" + str(e))

    # 打開圖像
    img = Image.open(imgPath)

    # 創建 ImageDraw 對象
    draw = ImageDraw.Draw(img)

    # 指定繪製要素
    fontSize = 20
    borderWidth = 6
    fontSpace = fontSize - borderWidth
    fill_color = (144, 238, 144)

    # 繪製文字區塊外框、編號
    try:
        fnt = ImageFont.truetype("arial.ttf", fontSize)
        for i in range(len(drawCoord)):
            textNum = str(i+1)
            draw.rectangle(
                drawCoord[i], outline="LightGreen", width=borderWidth)
            # [x0, y0, x1, y1] 繪製標號方塊
            draw.rectangle([drawCoord[i][0]-fontSize, drawCoord[i][1], drawCoord[i]
                           [0], drawCoord[i][1]+fontSpace*2], fill=fill_color)
            if (len(textNum) == 1):
                # (x,y) 數字小於10時的標號位置
                draw.text((drawCoord[i][0]-int(fontSize*0.75), drawCoord[i][1]+borderWidth),
                          textNum,
                          font=fnt,
                          fill="Black")
            else:
                # (x,y) 數字大於或等於10時的標號位置
                draw.text((drawCoord[i][0]-int(fontSize), drawCoord[i][1]+borderWidth),
                          textNum,
                          font=fnt,
                          fill="Black")
    except Exception as e:
        print("[INFO]" + str(e))
    img.save("./dist/temp.jpg")
    return img


class TransResult:
    def __init__(self, transResult, modImage):
        self.transResult = transResult
        self.modImage = modImage

# 繁體中文:"chinese(tra)"
# 簡體中文:"chinese(sim)"
# 英文:"english"
# 日文:"japanese"
# 韓文:"korean"


def textTransModule(ocrlang, translang, imgPath):
    filteredOcrResult = ocr(ocrlang, imgPath)
    modImage = drawImg(filteredOcrResult, imgPath)
    if (len(filteredOcrResult) == 0):
        textTransResult = ["哎呀!好像找不到圖片上的文字呢!", "請確認您的圖片與語言的選擇是否正確。"]
        result = TransResult(textTransResult, modImage)
        # print("no result error")
        return result
    textTransResult = trans(translang, filteredOcrResult)
    result = TransResult(textTransResult, modImage)
    # print("pass")
    return result
