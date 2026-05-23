# Use a lightweight, secure Node alpine Linux base image
FROM node:20-alpine

# Set the operational directory inside the container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the server file and public asset folder into the image
COPY . .

# Document that the container listens on port 5000 internally
EXPOSE 5000

# Execute the start script defined in package.json
CMD ["npm", "start"]
