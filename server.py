import os
import io
from starlette.staticfiles import StaticFiles
from fastapi import FastAPI, UploadFile
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.param_functions import Form, File
from PIL import Image
import text_trans_module
rootPath = os.path.dirname(__file__)
app = FastAPI()
app.mount('/css', StaticFiles(directory=f'{rootPath}/dist/css'))
app.mount('/js', StaticFiles(directory=f'{rootPath}/dist/js'))


@app.get('/')
def home():
    with open('index.html', encoding='utf8') as file:
        return HTMLResponse(file.read())


@app.post('/api/upload')
async def upload(file: bytes = File(), sourceLang: str = Form(), targetLang: str = Form()):
    ...
    imageStream = io.BytesIO(file)
    imageFile = Image.open(imageStream)
    imageFile.save("./img/tempImage.jpg")
    transModuleResult = text_trans_module.textTransModule(sourceLang, targetLang, "./img/tempImage.jpg")
    transResult = '\n'.join(transModuleResult.transResult)
    return FileResponse(f'{rootPath}/dist/temp.jpg',filename=transResult)


@app.get('/api/temp')
def temp():
    return FileResponse(f'{rootPath}/dist/temp.jpg')


if __name__ == '__main__':
    os.chdir(rootPath)
    os.system(f'python -m uvicorn server:app --port 8001 --reload')
