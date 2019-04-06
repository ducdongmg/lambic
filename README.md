Lambic
==========

ビアバッシュを醸すWebアプリ


## Description

社内勉強会であるビアバッシュを盛り上げるためのアプリケーション。
発表の内容参照や、発表に対するレスポンスを行うことができる。

## Requirement

* npm
* Firebase
* firebase-tools

## Usage

以下URLにアクセスする。（ドメイン名はインストールしたサーバのもの）

`https://xxxxx/`

## Install

### セットアップ

セットアップには、firebase-tools が必要。

```bash
$ npm install -g firebase-tools
$ firebase login
```

```bash
$ git clone git@github.com:rodbb/lambic.git
$ cd lambic
$ npm install
```

### 開発用のコンパイルとホットリロード

```bash
$ npm run serve
```

### 本番用のコンパイルとミニフィ

```bash
$ npm run build
```

### Firebase Hosting にデプロイ

```bash
$ firebase deploy
```

## Licence

[MIT](https://github.com/rodbb/lambic/blob/master/LICENSE)
