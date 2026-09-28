# Nanashino-chan カタログ一括生成 — 導入・運用ガイド

## 今回できたこと

3アルバム・68曲を、アルバム別の原本データから一括生成します。
Chillhop完成ページを共通テンプレートにして、既存のURL・68曲の表記・ISRC・動画IDを維持しています。
Ambientの `Nightfall Vibes.` のピリオドも維持します。

既存の `.github/workflows/sitemap.yml` を拡張し、1つの処理で以下を実行します。

1. 原本・ジャケット・曲数・ISRC・動画IDのチェック
2. 個別HTML、一覧HTML、アルバム別の試聴データ、従来互換JSを生成
3. 検索、CSV、試聴への対応付け、構造化データを検証
4. 既存の `js/generate-sitemap.js` でサイトマップを生成
5. 生成結果を同じmainブランチにコミット
6. プレビュー用ZIPをActionsの成果物に保存
7. 初回設定後は同じ実行内でGitHub Pagesに公開

サイトマップは別方式へ置き換えていません。従来の264 URLを保持し、一覧と3枚のアルバムの計4 URLを追加しています。
旧プロトタイプ `catalog/nanashino-chan-b2b-catalog.html` は今回の登録対象にしません。

## 最初だけ必要な導入

このパッケージは、リポジトリのファイルを確認してローカルで検証した導入用ファイルです。
GitHubへのアップロード、リポジトリ設定の変更、Actionsの実行はまだ行っていません。

### 1. ファイルを反映

ZIPを解凍し、`INSTALL` の**中身**を `nanashino-chan/site` リポジトリのルートに重ねて反映します。
`INSTALL` というフォルダ自体をリポジトリに置かないでください。ZIPをアップロードするだけでも展開されません。

- `_catalog/` は追加。
- `scripts/` 内の3スクリプトは追加。
- `catalog/` は4つのHTMLを更新。
- `js/catalog/` は追加、`js/b2bvideos.js` と `js/generate-sitemap.js` は更新。
- `sitemap.xml` は今回の検証済み出力。
- `.github/workflows/sitemap.yml` は既存ファイルを置き換えます。別名で二重に登録しないでください。
- `CATALOG_GUIDE.md` は運用説明。

`.github` は隠しフォルダ扱いになることがあります。GitHubのWeb画面で作業する場合は、既存の `.github/workflows/sitemap.yml` を開き、鉛筆アイコンから同梱ファイルの全文で置き換える方法でも反映できます。
既存の画像はパッケージに重複同梱していません。リポジトリにある3ジャケットをそのまま使用します。

### 2. 生成が通ることを確認

GitHubの Actions → **Build Catalog and Sitemap** を開き、最新の実行が成功していることを確認します。
必要なら **Run workflow** からmainで実行します。
この時点では追加のPagesデプロイ処理は無効です。既存のブランチ公開設定はそのまま動きます。
実行が成功すると `site-preview` という成果物からサイト全体の出力をダウンロードできます。

### 3. 今後の自動公開を有効化

1. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に変更。
2. **Settings → Secrets and variables → Actions → Variables → New repository variable** で以下を登録。
   - Name: `CATALOG_DEPLOY_PAGES`
   - Value: `true`
3. Actions → **Build Catalog and Sitemap → Run workflow** をmainで実行。
4. buildとdeployが成功したことを確認。

この設定は初回だけです。変数を登録しただけでは実行されないので、最後のRun workflowも行ってください。
以後はmainへの反映時、手動実行時、従来どおり6時間ごとの定期実行時に生成と公開が進みます。
PRでは検証のみ行い、コミット・公開は行いません。

GitHubの自動コミットだけではPagesのブランチビルドが再実行されないため、公開処理を同じワークフローに含めています。
参考: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
参考: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 4枚目以降のあなたの依頼

ChatGPTには次だけ渡してください。複数アルバムを一度に渡せます。

「カタログに一括追加してください。配信情報、曲順どおりのYouTube動画ID、ジャケットを添付します。
現在のリポジトリの CATALOG_GUIDE.md と _catalog/ASSISTANT.md に従い、追加用ファイル一式を作ってください。
確認は不明点だけにしてください。」

全曲インストゥルメンタルという前提は維持します。
曲名のピリオド等は勝手に修正しません。

こちらが配信資料を整理し、紹介文・タグ・アルバム原本を作成してから、アップロード用にまとめます。
あなたは追加ファイルとジャケットをまとめて反映するだけです。
個別HTML・一覧・JS・サイトマップをそれぞれ編集したり依頼したりする必要はありません。
現状、ChatGPTからこのリポジトリへ直接書き込む接続は確認できていません。GitHubへのファイル反映は残ります。
書き込み可能な実行環境で利用する場合は、この同じ仕組みでコミットやPR作成までまとめられます。

## 原本の持ち方

- `_catalog/albums/*.json`: アルバムごとの原本。ページURL、ジャケット、紹介文、用途タグもここ。
- `_catalog/inbox/<slug>/release.txt`: DistroKidのコピーテキスト。
- `_catalog/inbox/<slug>/youtube.txt`: 曲順どおりの動画ID。1行1ID、または引用符付きのJS配列項目形式。
- `_catalog/templates/album.html`: 個別ページの共通テンプレート。
- `_catalog/templates/index.html`: 一覧の共通テンプレート。
- `_catalog/templates/runtime.js`: 試聴データの検索API。

ChillhopとRetro Pulseは既存の統合済みtracksを原本に移行しました。
Ambientは実際に今回の添付テキストと動画IDリストから読み込む形式です。
1アルバムは `tracks` と `sourceFiles` のどちらか一方で登録します。
`sourceFiles` 形式では、公開時に曲順・日付・UPCと曲数を照合します。
英語タイトルの選択・紹介文・権利管理情報は、事前に確認した原本に保存します。
生成処理が曲を聴いて動画の中身や権利を認定するわけではありません。

入力で不整合がある場合、生成を停止します。曲を推測したり、不足分を埋めたりして公開しません。

## ローカル実行（必要な場合のみ）

Node.js 22で、リポジトリのルートから実行。追加パッケージのインストールは不要。

```sh
node scripts/build-catalog.js --check
node scripts/build-catalog.js
node scripts/test-catalog.js
node js/generate-sitemap.js
node scripts/test-catalog.js --sitemap
node scripts/stage-pages.js
```

`_site/` が公開用のサイト全体です。通常はActionsが作成します。
`_catalog/`、`scripts/`、Git情報などの作業用ファイルをこの公開用出力から除外します。

## 変更ルール

- 曲データ・説明の修正: `_catalog/albums/` または参照する資料を修正。
- デザイン・共通注意書きの修正: `_catalog/templates/` を修正。
- 生成された `catalog/*.html` / `js/catalog/` / `js/b2bvideos.js` は直接編集しない。次の生成で原本の内容になります。
- 既存の3ページURLは変更しない。今後もslugとpageSlugは意図して設定する。
- アルバムを削除する操作は自動化していません。原本を消しても過去HTMLは削除されません。削除・URL変更をする場合は別途対応。

## 検証結果と範囲

- 既存3アルバムのランタイムデータを元ファイルと照合: 一致。
- 68曲すべての動画IDへの対応、タイトル/ISRC検索、ISRCコピー、CSV出力: JavaScript上のテスト成功。
- 一覧: 3アルバム・68曲、UPC検索、構造化データの件数を確認。
- 重複ISRC、存在しないジャケット、曲数違い、資料と動画IDの件数違い: 出力前に停止することを確認。
- 同じ原本で再生成: 全生成ファイルの内容が同一。
- 元のレスポンシブCSS: 3ページともChillhopテンプレートと一致。
- サイトマップ: 既存264 URLを保持、カタログ4 URLを追加、計268 URL。
- GitHub Actions上での実行と実サイトのデプロイは未実施。
- ブラウザーでの目視・YouTube側の実再生は未検証。動画の再生可否はYouTube側にも依存。

## 元に戻す場合

ZIP内の `ROLLBACK` に、今回変更する既存8ファイルの元データを保存しています。
1. 自動公開を有効化済みなら、`CATALOG_DEPLOY_PAGES` を `false` にする。
2. `ROLLBACK` の中身を同じ配置先へ戻してコミットする。
3. PagesをGitHub Actionsへ変更していた場合は、従来のブランチ公開設定に戻す（元設定を導入前に控えてください）。
追加された `_catalog/` 等は、元のワークフローから参照されなくなります。
導入後に別の変更を加えている場合は、その変更を上書きしないようコミット単位で戻してください。
