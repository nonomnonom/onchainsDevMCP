FROM oven/bun:1.0 as base

# Set working directory
WORKDIR /app

# Copy package.json and other dependency files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN bun run build

# Expose port
EXPOSE 1234

# Start the server
CMD ["bun", "run", "start"] 