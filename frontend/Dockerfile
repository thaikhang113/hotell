# Sử dụng Node.js image nhẹ
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package để cài thư viện trước (tối ưu cache)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

# Copy toàn bộ source code vào
COPY . .

# Mở port 3001 (Port mặc định của app.js)
EXPOSE 3001

# Lệnh chạy server
CMD ["npm", "start"]