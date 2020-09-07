# 다스봇 Rewrite / 오픈소스

### 설치하기

1:  mongodb 설치

```shell
sudo docker run -p 27017:27017 --name mongodb mongo
```

2:  라바링크 실행

```shell script
# 라바링크 다운받으세요

java -jar Lavalink.jar
```

3: pm2 설치
```
npm i -g pm2
```

3: 다스봇 실행

```
pm2 start --interpreter ./node_modules/.bin/ts-node src/index.ts
```
