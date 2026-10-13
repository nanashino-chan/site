# Discover 一般向けアルバム詳細・本番反映ガイド

承認済みテスト版を基に、93アルバム × 英語・日本語 = 186の独立したHTMLを生成しました。
作成日：2026-10-13（日本時間）
基準リポジトリ：nanashino-chan/site
取得時のコミット：76247ae0be19feb2daeaa976917144005537e18e

## 反映方法

このパッケージは既存サイトへの追加・更新ファイルです。単体のサイト全体ではありません。

1. `site-update/` の**中身**を既存の `site` リポジトリのルートへ、同じフォルダー構成で追加・更新してください。`site-update` というフォルダーをサイト内に作る必要はありません。
2. `.github/workflows/sitemap.yml` の更新も含めてください。隠しフォルダーがアップロード対象から漏れた場合は、GitHub上で該当ファイルを直接更新してください。
3. 新規ブランチ／プルリクエストで確認すると、本番公開前に検証できます。既存のActions設定ではmainへの反映が公開につながります。
4. Actions「Build Catalog and Sitemap」で、カタログ検証 → 一般向けページ生成 → サイトマップ生成 → 検証 → 静的サイト準備の成功を確認してください。
5. 検証環境で下記の実機確認を行ってからmainへ反映してください。`CATALOG_DEPLOY_PAGES=true` の既存設定なら、その後Pagesへデプロイされます。この作業ではGitHubへのpush・デプロイは実施していません。

取得後に同じ6つの既存ファイルを別途更新した場合は、上書きせず差分を統合してください。パッケージの `changes.patch` に追跡済み既存ファイルの差分があります。新規ファイルは `site-update/` に含まれます。

## 公開後のURL構成

一覧のURLは変えません。
- `/site/discover.html`
- `/site/discover-ja.html`

詳細の例：
- 英語：`/site/albums/chillhop-lofi-relax-focus-instrumental.html`
- 日本語：`/site/albums/chillhop-lofi-relax-focus-instrumental-ja.html`

全アルバムは既存データの `slug` を使います。B2Bの `catalog/` と分離しています。

旧リンク `discover.html?album=...` / `discover-ja.html?album=...` は、データ読込後に対応する詳細へ移動します。旧 `track=ISRC` 指定も引き継ぎ、曲位置を案内します。自動再生はしません。GitHub Pages上のクライアント側移動であり、HTTP 301ではありません。

一覧からの通常移動は履歴を追加し、ブラウザの「戻る」で一覧へ戻る構成です。旧共有URLからの移動は履歴を置換し、戻る操作で転送ループを起こさない構成です。詳細には言語別一覧へ戻る通常リンクもあります。

## 内容と動作

- 承認済みのジャケット・アルバム情報・試聴プレイヤー・曲一覧の構成。
- 曲名、アルバム名、ISRC、リリース日を既存データから出力。
- 初期状態ではジャケットと説明を表示し、空のiframeを作りません。
- 87アルバム・1,970曲はYouTubeの曲別プレイヤー。
- 6アルバム・141曲はApple Musicのアルバムプレイヤー。選択曲名を案内し、プレイヤー内で曲を選ぶ方式です。曲別の再生開始位置・フル再生を保証するものではありません。
- Apple Music、YouTube Musicへのリンク。直リンクがない場合は検索と明示。
- SNS音源検索用に「Nanashino-chan 曲名」をコピー。自動コピーに失敗した場合は手動コピー欄を表示。
- 言語切替で同じアルバムの別言語HTMLへ移動し、再生・曲選択を引き継ぎません。
- ページ離脱時と履歴キャッシュからの復元時にプレイヤーをリセット。
- 一覧の絞り込み・表示形式・スクロール位置を同じタブ内で保存。
- JavaScript無効時にも一覧に全アルバムの詳細リンクが表示されます。

## SEO設定

- 186ページそれぞれに固有のtitle、description。
- 自己参照canonical、相互のen/jaとx-defaultのhreflang。
- MusicAlbum / MusicRecordingのJSON-LD、OGP画像・説明。
- 186ページはindex対象。本番サイトマップは既存360 URLを保持し、合計546 URL。
- テスト用の4ページを本番ファイルに含めず、テストページの検索除外は変更しません。

検索結果への登録・掲載は検索エンジン側の判断です。本番反映後にSearch Consoleでサイトマップを再送信し、英日それぞれ代表ページのURL検査を行ってください。

## 自動生成を続ける方法

既存の `_catalog/albums/` データを更新する手順はそのままです。

```sh
node scripts/build-catalog.js
python3 scripts/build-discover.py
node js/generate-sitemap.js
python3 scripts/test-discover.py
node scripts/test-discover-behavior.cjs
node scripts/test-catalog.js --sitemap
node scripts/stage-pages.js
```

追加依存ライブラリはありません。Python 3とNode.jsを使用します。Actionsに同じ生成・検証の段階を追加済みです。

一般向けのテンプレートは `_discover/templates/album-en.html` と `album-ja.html`。見た目は `css/discover-album.css`、試聴等は `js/discover/album.js` です。生成後の186ファイルを個別編集せず、テンプレートや生成スクリプトを変更してください。

## 確認済み

- 186 HTML、英日合計4,222の曲行を生成。
- 全ページの曲名・ISRC・埋込データと、原データの一致。
- title・descriptionの一意性、canonical・英日hreflang、JSON-LD。
- 全詳細ページのローカル参照、言語切替先、画像、ID重複、初期iframe不在。
- 186 URLのサイトマップ収録。従来の360 URLとlastmodを保持。
- 一覧の旧共有URL処理、履歴を追加／置換するコード、JavaScript構文。
- 生成を再実行しても186ページと一覧2ページの内容が変わらないこと。
- 既存カタログ検証：93アルバム・2,111曲で成功。
- 模擬DOM／模擬YouTubeで、動画ID選択、準備完了・エラー表示、コピー、離脱・復元時のリセット、読み込みキャンセルを英日で検証。
- 模擬DOMでApple Musicの埋込URL、曲選択案内、離脱時のiframe除去を英日で検証。
- 既存B2B、トップページ、セキュリティ設定、音楽ジェネレーターのファイル変更なし。

## 公開前に必要な実機確認（未確認）

この環境ではブラウザ検証機能が利用できません。コード検証を実ブラウザ確認の代わりとはしていません。

1. PCとスマートフォンで一覧→詳細→ブラウザの戻る、一覧へ戻るボタン。
2. 絞り込み後の移動・復帰、スクロール復帰。
3. 再生前／読み込み中の見え方と実再生。YouTube対象とApple Music対象の両方。
4. 再生中に英日を切り替え、音声と曲選択がリセットされること。
5. 旧アルバム共有URLと、ISRC指定の旧曲共有URL。
6. コピー・貼り付け、サービスへの外部リンク、地域ごとの配信可否。
7. 全26曲などの各動画の再生可否はサービス側の状態も含め未確認。全1,970動画の実再生は行っていません。

## 更新範囲と戻し方

既存ファイルの更新は6つ：
`discover.html`、`discover-ja.html`、`js/generate-sitemap.js`、`scripts/stage-pages.js`、`.github/workflows/sitemap.yml`、`sitemap.xml`。

追加は `albums/` の186ページ、`_discover/` の2テンプレート、共通CSS/JS、生成・検証スクリプト、本ガイドです。

取り消す場合は、この反映コミットをrevertしてください。パッケージの `rollback-originals/` には更新前の6ファイルも入っています。復元時は新しい生成処理のworkflowを先に戻し、そのうえで今回追加したファイルだけを取り除いてください。既存B2Bデータは削除しないでください。
