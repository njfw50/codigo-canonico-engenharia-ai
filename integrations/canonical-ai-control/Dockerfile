FROM node:22-alpine
WORKDIR /opt/canonical-control
COPY --chown=node:node . .
USER node
ENV NODE_ENV=production PORT=3000 CANONICAL_DATA_DIR=/srv/canonical-control
EXPOSE 3000
# Mount a durable, writable volume at CANONICAL_DATA_DIR.
CMD ["node","src/interface/server.js"]
