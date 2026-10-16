# Vercel 部署说明

本仓库基于 [metowolf/Meting-API](https://github.com/metowolf/Meting-API)，迁移时版本为 `@meting/server 1.11.0`，上游提交为 `f8e6981e1710743cd0373cf85dcf2fabf4fd6eaf`。

- 生产分支：`main`，推送后由 Vercel 自动部署。
- 项目：`meting-api`。
- 接口：`https://meting-api.hoshizukimio.com/api`。
- Vercel 使用 Bun 预设和 `vercel.json` 中的运行时配置；`server.js` 加载上游入口，业务源码保持与上游一致。

## 环境变量

在 Vercel 项目 Settings → Environment Variables 中管理，修改后重新部署：

| 名称 | 用途 |
| --- | --- |
| `METING_URL` | 正式环境设置为 `https://meting-api.hoshizukimio.com`，用于生成跨站播放链接。预览环境留空，生成相对路径。 |
| `METING_TOKEN` | 音频、封面和歌词链接的签名密钥，使用私密环境变量保存。 |
| `METING_COOKIE_NETEASE` | 可选，网易云登录 Cookie。不要提交到 Git。 |
| `METING_COOKIE_ALLOW_HOSTS` | 可选，允许使用登录 Cookie 的来源主机名，以逗号分隔。 |

迁移时未配置网易云登录 Cookie。播放权限和返回的音频时长由音乐平台决定。

## 后续同步上游

首次使用新的本地克隆时添加上游：

```sh
git remote add upstream https://github.com/metowolf/Meting-API.git
```

在工作区干净时创建更新分支、合并上游并验证：

```sh
git switch main
git pull --ff-only origin main
git switch -c codex/update-meting
git fetch upstream master
git merge upstream/master
bun install --frozen-lockfile
bun run lint
git push -u origin codex/update-meting
```

检查 Vercel 预览环境中的歌单、音频跳转、封面和歌词后，再合并到 `main`。保留本仓库的 `server.js`、`vercel.json` 和私密文件忽略规则。
