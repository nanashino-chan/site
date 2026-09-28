# カタログ追加作業の引き継ぎ

毎回まず現在のリポジトリの原本とガイドを確認する。古い会話のHTMLを原本にしない。
ユーザーは資料・動画ID・ジャケットをまとめて渡す。通常の追加で個別HTMLや一覧の作成指示を再要求しない。

## 手順
1. アルバム別に資料と曲順の動画IDを照合。全曲instrumental=true。権利案内は既存原本とユーザー確認に従う。
2. 正式曲名を保持。Nightfall Vibes. の末尾は意図された正式表記。資料内のタイトル・曲順・件数に不明点があれば先にまとめて確認。
3. `_catalog/albums/<slug>.json` を追加。既存形式を参照して説明・用途タグ・reviewedAtを設定。pageSlug・画像名はユーザー指定を優先。
4. 新規の資料は `_catalog/inbox/<slug>/release.txt` と `youtube.txt` に保存し、sourceFilesで参照できる。直接tracksを登録する場合はsourceFilesを付けない。
5. ジャケットを `images/catalog/` に配置。ジャケット無しでは生成不可。
6. `node scripts/build-catalog.js` → `node scripts/test-catalog.js` → `node js/generate-sitemap.js` → `node scripts/test-catalog.js --sitemap`。
7. 元の曲のデータを勝手に変更しない。既存のサイトマップ処理を増設しない。個別ページは共通テンプレートで生成する。
8. 通常の追加納品は原本JSON・資料・新ジャケットが中心。ActionsがHTMLとJS等を生成する。ローカルでの生成結果も確認する。
9. GitHubへ書き込み可能か確認し、接続済みならユーザーの依頼範囲内で一括反映。未接続なら配置先付きの追加用ZIPを渡し、公開済みとは言わない。

原本には slug,title,artist,label,uploadDate,releaseDate,distributionUpc,format,trackCount,instrumental,tags,rights,pageSlug,cover,summary,description,genres,uses,moods,featuredOrder,reviewedAt と tracks または sourceFiles が必要。
summaryとdescriptionはプレーンテキスト。HTMLのエンティティを事前に入れない。
元ファイルからの丸写しで紹介文やジャンルが誤る場合はアルバムの提供情報に基づいて変更する。実際に試聴していなければ聴いたと主張しない。
ユーザーはJSONの手入力や生成コマンドの毎回実行を望んでいない。これらは担当エージェントとActions側で処理する。
