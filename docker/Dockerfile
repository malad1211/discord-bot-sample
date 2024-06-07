# STAGE 1: A container with pnpm and python3 is required
FROM node:18-alpine3.18 as builder
WORKDIR /app
# install pnpm
RUN npm i --global pnpm@latest-9
# install python3 and other deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache linux-headers libc6-compat g++ py3-pip python3 make

# # Fetch deps into the pnpm store
# # We run pnpm fetch in a separate step to avoid re-fetching deps on every code change
# # fetch is a pnpm command that downloads all dependencies to the local store
# # You could remove or skip this step if using npm or yarn (but make sure to copy your lock file)
# # copy the lock file that you use
# RUN pnpm config set store-dir /workdir/.pnpm-store
# RUN pnpm fetch
# ARG BOT_PRIVATE_TOKEN=${BOT_PRIVATE_TOKEN}

# COPY .npmrc /app/.npmrc
COPY package.json /app/
COPY pnpm-lock.yaml /app/
# finally, install all the deps
RUN pnpm install --prod && cp -r node_modules node_modules_prod && pnpm install

# Build the app
ARG BUILD_MODE=$BUILD_MODE
COPY . /app/
RUN BUILD_MODE=$BUILD_MODE pnpm build

# STAGE 2: Create a clean production image - only take pruned assets
FROM node:18-alpine3.18 as runner
WORKDIR /app
ARG SERVICE='service'

# We add a non-root user to run the app for security reasons
RUN addgroup --system --gid 1001 $SERVICE && adduser --system --uid 1001 $SERVICE
USER $SERVICE

COPY --chown=$SERVICE:$SERVICE --from=builder /app/node_modules_prod /app/node_modules
COPY --chown=$SERVICE:$SERVICE --from=builder /app/package.json /app/package.json
COPY --chown=$SERVICE:$SERVICE --from=builder /app/dist /app

EXPOSE 8080
ENV APP_PORT 8080
CMD ["node", "app.js"]