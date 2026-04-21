# 自动化部署说明

## 目标

给 `uni-admin` 提供一套可直接落地的自动化部署链路：

- GitHub Actions 做质量检查
- GitHub Actions 构建 H5 静态产物
- 通过 SSH 上传到阿里云 ECS
- 在服务器上通过 `nginx:alpine` 容器托管静态文件
- 保留最近几次发布，便于回滚
- 新版本健康检查失败时自动回滚到上一个版本

整个流程 **不在服务器上执行 `pnpm install` / `pnpm build`**，避免占用服务器内存。

## 工作流

### 1. 质量检查

文件：`.github/workflows/quality.yml`

触发条件：

- push 到 `main` / `master`
- pull request

执行内容：

- 安装依赖
- `pnpm lint`
- `pnpm type-check`
- `pnpm test --run`
- `pnpm build`

### 2. 生产部署

文件：`.github/workflows/deploy-aliyun-ecs.yml`

触发条件：

- push 到 `main` / `master`
- 手动 `workflow_dispatch`

执行内容：

1. 安装依赖并完成质量检查
2. 构建 H5 产物
3. 自动识别构建输出目录
4. 将产物打成 `tar.gz`，并生成 `sha256` 校验文件
5. 将构建产物额外留档到 GitHub Actions Artifacts，方便排查
6. 上传部署脚本、Nginx 配置、静态产物到 ECS
7. 服务器校验压缩包完整性后解压到 `releases/<sha>`
8. 更新 `current` 软链接
9. `docker compose up -d --force-recreate`
10. 检查 `http://127.0.0.1:<HOST_PORT>/healthz`
11. 如果新版本健康检查失败，自动切回上一个版本

## 需要配置的 GitHub Secrets

仓库 Settings → Secrets and variables → Actions → Secrets：

- `ALIYUN_ECS_HOST`：服务器地址
- `ALIYUN_ECS_USER`：SSH 用户名
- `ALIYUN_ECS_SSH_KEY`：部署私钥内容

## 建议配置的 GitHub Variables

仓库 Settings → Secrets and variables → Actions → Variables：

- `ALIYUN_ECS_PORT`：SSH 端口，默认 `22`
- `ALIYUN_DEPLOY_PATH`：部署目录，默认 `/opt/uni-admin`
- `ALIYUN_CONTAINER_NAME`：容器名，默认 `uni-admin`
- `ALIYUN_HOST_PORT`：容器映射到宿主机的端口，默认 `25003`
- `ALIYUN_PORT_MAPPING`：完整端口映射，默认 `127.0.0.1:25003:80`
- `ALIYUN_APP_DOMAIN`：对外访问域名，默认 `m.bzsh.fun`
- `ALIYUN_KEEP_RELEASES`：保留发布版本数，默认 `5`

## 服务器前置要求

建议目标服务器至少具备：

- Docker
- Docker Compose Plugin（`docker compose`）
- `tar`
- `curl` 或 `wget`
- `sha256sum`（建议安装，用于校验上传产物）

## 推荐服务器目录结构

```text
/opt/uni-admin
├── current -> /opt/uni-admin/releases/<sha>
├── releases/
│   ├── <sha-1>/
│   └── <sha-2>/
└── deploy/
    ├── deploy.sh
    ├── rollback.sh
    ├── list-releases.sh
    ├── docker-compose.prod.yml
    ├── nginx.conf
    └── Caddyfile.example
```

## 反向代理建议

当前默认映射：

- `127.0.0.1:25003 -> container:80`

也就是默认只监听本机回环地址，更安全，适合再由 Caddy / Nginx 统一反向代理到正式域名。

如果你想直接暴露到公网，可以把 `ALIYUN_PORT_MAPPING` 改成：

```text
25003:80
```

仓库里已附带一个示例文件：`deploy/Caddyfile.example`

示例含义很简单：

- 域名 `m.bzsh.fun`
- 反代到 `127.0.0.1:25003`

## 回滚

仓库已提供：

- `deploy/rollback.sh`
- `deploy/list-releases.sh`

每次发布目录里还会写入 `.release-meta`，方便后续排查当前运行的是哪次发布。

查看当前 release 列表：

```bash
export DEPLOY_PATH=/opt/uni-admin
bash /opt/uni-admin/deploy/list-releases.sh
```

回滚到上一个版本：

```bash
export DEPLOY_PATH=/opt/uni-admin
export HOST_PORT=25003
bash /opt/uni-admin/deploy/rollback.sh
```

回滚到指定 release：

```bash
export DEPLOY_PATH=/opt/uni-admin
export HOST_PORT=25003
bash /opt/uni-admin/deploy/rollback.sh <release-id>
```

## 后续可继续增强

可以继续补这些能力：

- 钉钉 / 飞书 / Telegram 部署通知
- 自动刷新远端 Caddy 配置
- 灰度发布 / 手动审批
- 基于 tag 的正式发版流程
- 部署前远端磁盘空间检查
