# Node.js image
FROM node:18

# working directory
WORKDIR /.

# package.json 복사 및 패키지 설치
COPY package.json ./

RUN npm install


# 소스 코드 복사
COPY . .

# 실행 명령어
CMD ["node", "index.js"]