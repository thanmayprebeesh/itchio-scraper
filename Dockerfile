# Use official Node image
FROM node:18

# Create app directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Expose port (adjust if your app uses a different port)
EXPOSE 8000

# Start the API
CMD ["node", "index.js"]
