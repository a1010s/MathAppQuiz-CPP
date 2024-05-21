# Use a base image with g++ and required libraries
FROM gcc:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the backend files into the container
COPY backend /app/backend

# Download httplib.h and json.hpp
RUN apt-get update && apt-get install -y curl \
    && curl -L https://github.com/yhirose/cpp-httplib/raw/master/httplib.h -o httplib.h \
    && curl -L https://github.com/nlohmann/json/releases/download/v3.9.1/json.hpp -o json.hpp

# Copy questions.txt into the container
COPY backend/questions.txt /app/questions.txt

# Build the backend
RUN g++ -std=c++14 -o mathquiz backend/main.cpp -I. -I/app

# Expose port 9080 (assuming you are using port 9080 for the backend)
EXPOSE 9080

# Command to run the built backend executable
CMD ["./mathquiz"]
